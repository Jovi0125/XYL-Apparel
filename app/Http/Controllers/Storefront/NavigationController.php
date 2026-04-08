<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NavigationController extends Controller
{
    /**
     * Display the navigation/search experience.
     */
    public function index(Request $request, $parent = 'women')
    {
        // Normalize parent slug
        $parent = strtolower($parent);
        
        // Fetch child categories for the specific parent (children only)
        $query = Category::active()
            ->whereNotNull('parent_id')
            ->where('parent_category', $parent);

        // Dynamic Filtering
        if ($request->filled('q')) {
            $search = $request->query('q');
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->get();

        // Load products with main images, grouped by category
        $productsByCategoryId = Product::with('mainImage')
            ->whereHas('mainImage')
            ->whereIn('category_id', $categories->pluck('id'))
            ->get()
            ->groupBy('category_id');

        // Enrich categories with product thumbnails
        $enrichedCategories = $categories->map(function ($cat) use ($productsByCategoryId) {
            $catProducts = $productsByCategoryId->get($cat->id, collect());
            $representativeProduct = $catProducts->first();

            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'description' => $cat->description,
                'image_url' => $cat->image_url,
                'product_image' => $representativeProduct?->mainImage?->image_url,
                'product_count' => $catProducts->count(),
            ];
        })->values();

        // Component mapping
        $component = ucfirst($parent) . 'Navi';
        
        return Inertia::render("Navigation/{$component}", [
            'categories' => $enrichedCategories,
            'activeSection' => $parent,
            'searchQuery' => $request->query('q', ''),
        ]);
    }
}
