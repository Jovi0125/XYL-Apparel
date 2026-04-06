<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class NavigationController extends Controller
{
    /**
     * Display the contextual navigation hub.
     */
    public function show(Request $request)
    {
        // 1. Detect Active Parent Category from Route Name
        $routeName = $request->route()->getName();
        
        $activeParentNormalized = match ($routeName) {
            'men_navi' => 'Men',
            'unisex_navi' => 'Unisex',
            default => 'Women', // Default to women_navi
        };

        // 2. 💡 Fetch the Parent Record first (Women, Men, or Unisex)
        $parent = Category::where('name', $activeParentNormalized)->first();

        // 3. 💡 Fetch its Children (T-Shirts, etc.)
        $categories = $parent 
            ? $parent->children()->where('status', 'active')->get() 
            : collect();

        return view('storefront.navigation', [
            'activeParent' => strtolower($activeParentNormalized),
            'categories' => $categories
        ]);
    }
}
