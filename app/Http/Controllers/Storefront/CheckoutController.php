<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Discount;
use App\Models\Order;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Show the checkout page.
     */
    public function index()
    {
        $cartItems = CartItem::with(['product.mainImage', 'variant'])
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect('/ph/en/cart')->with('error', 'Your cart is empty.');
        }

        $subtotal = $cartItems->sum('line_total');
        $tax = round($subtotal * 0.12, 2);
        $shipping = $subtotal >= 3000 ? 0 : 150;
        $total = $subtotal + $tax + $shipping;

        return Inertia::render('Storefront/Checkout', [
            'cartItems' => $cartItems,
            'summary' => [
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'total' => $total,
            ],
            'user' => Auth::user(),
        ]);
    }

    /**
     * Process checkout — create orders for each cart item, create shipments, clear cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => ['required', 'string', 'max:500'],
            'contact_number'   => ['required', 'string', 'max:20'],
            'payment_method'   => ['required', 'in:cod'],
            'notes'            => ['nullable', 'string', 'max:1000'],
            'discount_code'    => ['nullable', 'string', 'max:50'],
        ]);

        // Resolve discount if provided
        $discount = null;
        if ($request->filled('discount_code')) {
            $discount = Discount::where('code', strtoupper($request->discount_code))
                ->valid()
                ->first();
            if (!$discount) {
                return back()->withErrors(['discount_code' => 'Invalid or expired discount code.'])->withInput();
            }
        }

        $cartItems = CartItem::with(['product', 'variant'])
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Your cart is empty.');
        }

        DB::transaction(function () use ($request, $cartItems, $discount) {
            foreach ($cartItems as $item) {
                $unitPrice  = $item->unit_price;
                $totalAmount = $unitPrice * $item->quantity;
                $tax        = round($totalAmount * 0.12, 2);
                $shipping   = $totalAmount >= 3000 ? 0 : 150;

                // Apply discount proportionally per item (by share of subtotal)
                $discountAmount = 0;
                if ($discount) {
                    $cartSubtotal  = $cartItems->sum('line_total');
                    $itemShare     = $cartSubtotal > 0 ? ($item->line_total / $cartSubtotal) : 1;
                    $totalDiscount = $discount->calculateDiscount($cartSubtotal);
                    $discountAmount = round($totalDiscount * $itemShare, 2);
                }

                $grandTotal = max(0, $totalAmount + $tax + $shipping - $discountAmount);
                // Build variant label
                $variantLabel = '';
                if ($item->variant) {
                    $variantLabel = $item->variant->size;
                }
                if ($item->color) {
                    $variantLabel = $variantLabel ? "{$variantLabel} / {$item->color}" : $item->color;
                }

                $order = Order::create([
                    'order_number' => Order::generateOrderNumber(),
                    'buyer_id' => Auth::id(),
                    'product_id' => $item->product_id,
                    'product_variant_label' => $variantLabel ?: null,
                    'quantity' => $item->quantity,
                    'unit_price' => $unitPrice,
                    'total_amount' => $grandTotal,
                    'earnings' => $totalAmount, // net before tax/shipping
                    'payment_method' => $request->payment_method,
                    'payment_status' => 'pending',
                    'shipping_address' => $request->shipping_address,
                    'contact_number' => $request->contact_number,
                    'notes' => $request->notes,
                ]);

                // Order starts as 'pending' — no shipment until admin approves

                // Decrement stock
                if ($item->variant) {
                    $item->variant->decrement('stock', $item->quantity);
                } else {
                    $item->product->decrement('stock', $item->quantity);
                }
            }

            // Clear the cart
            CartItem::where('user_id', Auth::id())->delete();

            // Increment discount usage
            if ($discount) {
                $discount->incrementUsage();
            }
        });

        return redirect('/ph/en/profile/orders')->with('success', 'Order placed successfully!');
    }

    /**
     * Validate a discount code via AJAX during checkout.
     */
    public function validateDiscount(Request $request)
    {
        $request->validate([
            'code'     => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $discount = Discount::where('code', strtoupper($request->code))
            ->valid()
            ->first();

        if (!$discount) {
            return response()->json([
                'valid'   => false,
                'message' => 'Invalid or expired discount code.',
            ], 422);
        }

        $discountAmount = $discount->calculateDiscount($request->subtotal);

        return response()->json([
            'valid'    => true,
            'code'     => $discount->code,
            'title'    => $discount->title,
            'type'     => $discount->type,
            'value'    => $discount->value,
            'discount_amount' => $discountAmount,
        ]);
    }
}
