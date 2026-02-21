<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class WishlistController extends Controller
{
    /**
     * Show the wishlist page.
     */
    public function index(): View
    {
        $wishlists = Wishlist::where('user_id', Auth::id())
            ->with(['product.primaryImage', 'product.sellerProfile', 'product.category'])
            ->latest()
            ->paginate(12);

        return view('customer.wishlist.index', compact('wishlists'));
    }

    /**
     * Toggle a product in the wishlist (add or remove).
     */
    public function toggle(Product $product): RedirectResponse
    {
        $existing = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Removed from wishlist.');
        }

        Wishlist::create([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
        ]);

        return back()->with('success', 'Added to wishlist!');
    }

    /**
     * Remove from wishlist.
     */
    public function destroy(Wishlist $wishlist): RedirectResponse
    {
        abort_if($wishlist->user_id !== Auth::id(), 403);

        $wishlist->delete();

        return back()->with('success', 'Removed from wishlist.');
    }
}
