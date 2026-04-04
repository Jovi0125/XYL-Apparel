<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function globalSearch(Request $request)
    {
        $query = $request->input('query');
        if (!$query) return response()->json([]);

        $products = Product::where('title', 'LIKE', "%{$query}%")
            ->with(['category', 'mainImage'])
            ->limit(5)
            ->get();

        $categories = Category::where('name', 'LIKE', "%{$query}%")
            ->limit(3)
            ->get();

        // Inventory search functionality
        $inventory = Product::where('title', 'LIKE', "%{$query}%")
            ->limit(3)
            ->get()
            ->filter(fn($p) => $p->is_low_stock)
            ->values();

        return response()->json([
            'products' => $products,
            'categories' => $categories,
            'inventory' => $inventory,
            'query' => $query
        ]);
    }
}
