<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\SellerProfile;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BrowseController extends Controller
{
    /**
     * Browse / search products.
     */
    public function index(Request $request): View
    {
        $query = Product::query()
            ->where('is_active', true)
            ->whereHas('sellerProfile', fn ($q) => $q->where('status', 'approved'));

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($categoryId = $request->input('category')) {
            $query->where('category_id', $categoryId);
        }

        // Filter by seller / shop
        if ($sellerId = $request->input('seller')) {
            $query->where('seller_profile_id', $sellerId);
        }

        // Price range
        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        $query = match ($sort) {
            'price_low'  => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'popular'    => $query->orderBy('views_count', 'desc'),
            default      => $query->latest(),
        };

        $products = $query->with(['primaryImage', 'sellerProfile', 'category'])
            ->paginate(12)
            ->withQueryString();

        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();

        return view('customer.browse.index', compact('products', 'categories'));
    }

    /**
     * Show a single product with details.
     */
    public function show(Product $product): View
    {
        abort_if(! $product->is_active, 404);

        $product->increment('views_count');

        $product->load([
            'sellerProfile',
            'category',
            'images' => fn ($q) => $q->orderBy('sort_order'),
            'variants' => fn ($q) => $q->where('is_active', true),
        ]);

        $isWishlisted = auth()->user()->wishlists()->where('product_id', $product->id)->exists();

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->with('primaryImage')
            ->take(4)
            ->get();

        return view('customer.browse.show', compact('product', 'isWishlisted', 'relatedProducts'));
    }

    /**
     * Show a seller's shop page.
     */
    public function shop(SellerProfile $sellerProfile): View
    {
        abort_if($sellerProfile->status !== 'approved', 404);

        $products = Product::where('seller_profile_id', $sellerProfile->id)
            ->where('is_active', true)
            ->with('primaryImage')
            ->latest()
            ->paginate(12);

        return view('customer.browse.shop', compact('sellerProfile', 'products'));
    }
}
