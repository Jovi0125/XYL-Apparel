<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NavigationController extends Controller
{
    /**
     * Display the navigation/search experience.
     * Fetches categories for a given parent (Women, Men, Unisex).
     */
    public function index(Request $request, $parent = 'women')
    {
        // Normalize parent slug
        $parentSlug = strtolower($parent);
        $parentName = ucfirst($parentSlug); // Women, Men, Unisex

        // Query categories by parent_category field
        $query = Category::active()
            ->where('parent_category', $parentName);

        // Search filtering
        if ($request->filled('q')) {
            $search = $request->query('q');
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->orderBy('name')->get(['id', 'name', 'description', 'image_url']);

        // Component mapping (WomenNavi, MenNavi, UnisexNavi)
        $component = $parentName . 'Navi';
        
        return Inertia::render("Navigation/{$component}", [
            'categories' => $categories,
            'activeSection' => $parentSlug,
            'searchQuery' => $request->query('q', ''),
        ]);
    }
}
