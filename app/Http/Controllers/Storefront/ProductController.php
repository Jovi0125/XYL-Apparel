<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Wishlist;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Product listing — browse products by parent category.
     */
    public function index(Request $request, string $parentCategory)
    {
        $parentCategory = ucfirst(strtolower($parentCategory)); // Normalize: "men" → "Men"

        $query = Product::with(['mainImage', 'images', 'variants', 'category', 'discountCode'])
            ->where('status', 'active')
            ->where('parent_category', $parentCategory);

        // Optional subcategory filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->query('category'));
        }

        $products = $query->latest()->get();

        // Get subcategories for filter tabs
        $categories = Category::active()
            ->whereNotNull('parent_id')
            ->where('parent_category', strtolower($parentCategory))
            ->get(['id', 'name']);

        return Inertia::render('Storefront/ProductListing', [
            'products' => $products,
            'categories' => $categories,
            'parentCategory' => strtolower($parentCategory),
            'activeCategory' => $request->query('category', null),
        ]);
    }

    /**
     * Product Detail Page (PDP).
     */
    public function show(Product $product)
    {
        $product->load(['images', 'variants', 'category', 'discountCode']);

        // Get related products from same category
        $relatedProducts = Product::with('mainImage')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'active')
            ->limit(4)
            ->get();

        $isWishlisted = Auth::check() 
            ? Wishlist::where('user_id', Auth::id())->where('product_id', $product->id)->exists()
            : false;

        $reviews = Review::with('buyer')
            ->where('product_id', $product->id)
            ->where('is_approved', true)
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'buyer_name' => $r->buyer?->name ?? 'Anonymous',
                'created_at' => $r->created_at->format('M d, Y'),
            ]);

        $avgRating = $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : null;

        return Inertia::render('Storefront/ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'isWishlisted' => $isWishlisted,
            'reviews' => $reviews,
            'avgRating' => $avgRating,
        ]);
    }
}
