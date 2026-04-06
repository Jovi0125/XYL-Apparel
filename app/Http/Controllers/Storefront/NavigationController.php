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
     */
    public function index(Request $request, $parent = 'women')
    {
        // Normalize parent slug
        $parent = strtolower($parent);
        
        // Fetch child categories for the specific parent
        $query = Category::active()
            ->where('parent_category', $parent);

        // Dynamic Filtering
        if ($request->filled('q')) {
            $search = $request->query('q');
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->get(['id', 'name', 'description', 'image_url']);

        // Component mapping
        $component = ucfirst($parent) . 'Navi';
        
        return Inertia::render("Navigation/{$component}", [
            'categories' => $categories,
            'activeSection' => $parent,
            'searchQuery' => $request->query('q', ''),
        ]);
    }
}
