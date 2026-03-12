<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CheckoutRequest;
use App\Models\Cart;
use App\Models\DiscountCode;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    /**
     * Show the checkout page.
     */
    public function index(Request $request)
    {
        $cartItems = Cart::where('user_id', Auth::id())
            ->with(['product.primaryImage', 'product.sellerProfile', 'variant'])
            ->get();

        if ($cartItems->isEmpty()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Your cart is empty.'], 422);
            }
            return redirect()->route('customer.cart.index')
                ->with('error', 'Your cart is empty.');
        }

        // Group items by seller
        $grouped = $cartItems->groupBy(fn ($item) => $item->product->seller_profile_id);

        $shippingFee = (float) SystemSetting::get('default_shipping_fee', 50);

        $subtotal = $cartItems->sum(function ($item) {
            $price = $item->variant && $item->variant->price_override
                ? $item->variant->price_override
                : $item->product->effective_price;
            return $price * $item->quantity;
        });

        if ($request->expectsJson()) {
            return response()->json(compact('cartItems', 'grouped', 'subtotal', 'shippingFee'));
        }

        return view('welcome');
    }

    /**
     * Apply a discount code (AJAX-friendly).
     */
    public function applyDiscount(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $discount = DiscountCode::where('code', $request->code)->first();

        if (! $discount || ! $discount->isValid()) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Invalid or expired discount code.'], 422);
            }
            return back()->with('error', 'Invalid or expired discount code.');
        }

        // Store in session
        session(['discount_code_id' => $discount->id, 'discount_code' => $discount->code]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => "Discount code \"{$discount->code}\" applied!", 'discount' => $discount]);
        }

        return back()->with('success', "Discount code \"{$discount->code}\" applied!");
    }

    /**
     * Remove applied discount.
     */
    public function removeDiscount(Request $request)
    {
        session()->forget(['discount_code_id', 'discount_code']);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Discount code removed.']);
        }

        return back()->with('success', 'Discount code removed.');
    }

    /**
     * Place the order.
     */
    public function store(CheckoutRequest $request)
    {
        $user = Auth::user();

        $cartItems = Cart::where('user_id', $user->id)
            ->with(['product.sellerProfile', 'variant'])
            ->get();

        if ($cartItems->isEmpty()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Your cart is empty.'], 422);
            }
            return redirect()->route('customer.cart.index')
                ->with('error', 'Your cart is empty.');
        }

        $shippingFee = (float) SystemSetting::get('default_shipping_fee', 50);
        $commissionRate = (float) SystemSetting::get('platform_commission', 10);

        // Retrieve discount if applied
        $discount = null;
        if ($discountId = session('discount_code_id')) {
            $discount = DiscountCode::find($discountId);
            if ($discount && ! $discount->isValid()) {
                $discount = null;
                session()->forget(['discount_code_id', 'discount_code']);
            }
        }

        // Group cart items by seller
        $grouped = $cartItems->groupBy(fn ($item) => $item->product->seller_profile_id);

        DB::transaction(function () use ($grouped, $request, $user, $shippingFee, $commissionRate, $discount) {
            foreach ($grouped as $sellerProfileId => $items) {
                $subtotal = $items->sum(function ($item) {
                    $price = $item->variant && $item->variant->price_override
                        ? $item->variant->price_override
                        : $item->product->effective_price;
                    return $price * $item->quantity;
                });

                // Calculate discount for this sub-order
                $discountAmount = 0;
                if ($discount) {
                    // Only apply if seller matches or discount is global
                    if ($discount->seller_profile_id === null || $discount->seller_profile_id == $sellerProfileId) {
                        if (! $discount->min_order_amount || $subtotal >= $discount->min_order_amount) {
                            $discountAmount = $discount->type === 'percentage'
                                ? round($subtotal * ($discount->value / 100), 2)
                                : min($discount->value, $subtotal);
                        }
                    }
                }

                $total = $subtotal - $discountAmount + $shippingFee;
                $platformFee = round($subtotal * ($commissionRate / 100), 2);

                $order = Order::create([
                    'order_number' => Order::generateOrderNumber(),
                    'customer_id' => $user->id,
                    'seller_profile_id' => $sellerProfileId,
                    'order_status' => 'pending',
                    'subtotal' => $subtotal,
                    'discount_amount' => $discountAmount,
                    'shipping_fee' => $shippingFee,
                    'total' => $total,
                    'platform_fee' => $platformFee,
                    'shipping_name' => $request->shipping_name,
                    'shipping_phone' => $request->shipping_phone,
                    'shipping_address' => $request->shipping_address,
                    'shipping_city' => $request->shipping_city,
                    'payment_method' => 'cod',
                    'payment_status' => 'unpaid',
                    'notes' => $request->notes,
                ]);

                foreach ($items as $item) {
                    $unitPrice = $item->variant && $item->variant->price_override
                        ? $item->variant->price_override
                        : $item->product->effective_price;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'product_variant_id' => $item->product_variant_id,
                        'product_name' => $item->product->name,
                        'variant_label' => $item->variant ? $item->variant->label : null,
                        'quantity' => $item->quantity,
                        'unit_price' => $unitPrice,
                        'total_price' => $unitPrice * $item->quantity,
                    ]);

                    // Decrement stock
                    if ($item->product_variant_id) {
                        ProductVariant::where('id', $item->product_variant_id)
                            ->decrement('stock', $item->quantity);
                    }
                }
            }

            // Increment discount usage
            if ($discount) {
                $discount->increment('used_count');
            }

            // Clear cart
            Cart::where('user_id', Auth::id())->delete();

            // Clear discount session
            session()->forget(['discount_code_id', 'discount_code']);
        });

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Order placed successfully! Seller will process your order.']);
        }

        return redirect()->route('customer.orders.index')
            ->with('success', 'Order placed successfully! Seller will process your order.');
    }
}
