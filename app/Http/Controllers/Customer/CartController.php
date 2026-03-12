<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Show the cart page.
     */
    public function index(Request $request)
    {
        $cartItems = Cart::where('user_id', Auth::id())
            ->with(['product.primaryImage', 'product.sellerProfile', 'variant'])
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            $price = $item->variant && $item->variant->price_override
                ? $item->variant->price_override
                : $item->product->effective_price;
            return $price * $item->quantity;
        });

        if ($request->expectsJson()) {
            return response()->json(compact('cartItems', 'subtotal'));
        }

        return view('welcome');
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $product = Product::findOrFail($request->product_id);
        abort_if(! $product->is_active, 404);

        // Check variant belongs to product
        if ($request->product_variant_id) {
            $variant = ProductVariant::where('id', $request->product_variant_id)
                ->where('product_id', $product->id)
                ->where('is_active', true)
                ->firstOrFail();

            // Check stock
            if ($variant->stock < $request->quantity) {
                if ($request->expectsJson()) {
                    return response()->json(['success' => false, 'message' => 'Not enough stock available for this variant.'], 422);
                }
                return back()->with('error', 'Not enough stock available for this variant.');
            }
        }

        // Check if item already in cart
        $existing = Cart::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        if ($existing) {
            $existing->update(['quantity' => $existing->quantity + $request->quantity]);
        } else {
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity,
            ]);
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Item added to cart.']);
        }

        return back()->with('success', 'Item added to cart.');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, Cart $cart)
    {
        abort_if($cart->user_id !== Auth::id(), 403);

        $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        // Check variant stock
        if ($cart->product_variant_id) {
            $variant = ProductVariant::find($cart->product_variant_id);
            if ($variant && $variant->stock < $request->quantity) {
                if ($request->expectsJson()) {
                    return response()->json(['success' => false, 'message' => 'Not enough stock available.'], 422);
                }
                return back()->with('error', 'Not enough stock available.');
            }
        }

        $cart->update(['quantity' => $request->quantity]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Cart updated.']);
        }

        return back()->with('success', 'Cart updated.');
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, Cart $cart)
    {
        abort_if($cart->user_id !== Auth::id(), 403);

        $cart->delete();

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Item removed from cart.']);
        }

        return back()->with('success', 'Item removed from cart.');
    }

    /**
     * Clear the entire cart.
     */
    public function clear(Request $request)
    {
        Cart::where('user_id', Auth::id())->delete();

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Cart cleared.']);
        }

        return back()->with('success', 'Cart cleared.');
    }
}
