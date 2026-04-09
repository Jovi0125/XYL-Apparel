<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display the wishlist page.
     */
    public function index()
    {
        $wishlistItems = Wishlist::with(['product.mainImage', 'product.images', 'product.category'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($item) {
                $product = $item->product;
                return [
                    'id' => $item->id,
                    'product_id' => $product->id,
                    'title' => $product->title,
                    'image' => $product->mainImage?->image_url ?? $product->images?->first()?->image_url,
                    'regular_price' => $product->regular_price,
                    'sale_price' => $product->sale_price,
                    'final_price' => $product->final_price,
                    'category' => $product->category?->name,
                    'parent_category' => $product->category?->parent?->slug ?? 'women',
                    'stock' => $product->stock,
                    'added_at' => $item->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Storefront/Wishlist', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    /**
     * Toggle wishlist item (add if not exists, remove if exists).
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $existing = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Removed from wishlist.');
        }

        Wishlist::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
        ]);

        return back()->with('success', 'Added to wishlist!');
    }

    /**
     * Remove from wishlist.
     */
    public function destroy(Wishlist $wishlist)
    {
        if ($wishlist->user_id !== Auth::id()) {
            abort(403);
        }

        $wishlist->delete();

        return back()->with('success', 'Removed from wishlist.');
    }
}
