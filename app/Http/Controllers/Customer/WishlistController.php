<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Show the wishlist page.
     */
    public function index(Request $request)
    {
        $wishlists = Wishlist::where('user_id', Auth::id())
            ->with(['product.primaryImage', 'product.sellerProfile', 'product.category'])
            ->latest()
            ->paginate(12);

        if ($request->expectsJson()) {
            return response()->json(compact('wishlists'));
        }

        return view('welcome');
    }

    /**
     * Toggle a product in the wishlist (add or remove).
     */
    public function toggle(Request $request, Product $product)
    {
        $existing = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Removed from wishlist.', 'wishlisted' => false]);
            }
            return back()->with('success', 'Removed from wishlist.');
        }

        Wishlist::create([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
        ]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Added to wishlist!', 'wishlisted' => true]);
        }

        return back()->with('success', 'Added to wishlist!');
    }

    /**
     * Remove from wishlist.
     */
    public function destroy(Request $request, Wishlist $wishlist)
    {
        abort_if($wishlist->user_id !== Auth::id(), 403);

        $wishlist->delete();

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Removed from wishlist.']);
        }

        return back()->with('success', 'Removed from wishlist.');
    }
}
