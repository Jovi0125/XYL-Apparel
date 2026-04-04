<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard
     */
    public function index(): Response
    {
        $lowStockCount = Product::all()->filter(fn($p) => $p->is_low_stock)->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalProducts' => Product::count(),
                'totalOrders' => 0, // Placeholder
                'totalCategories' => Category::count(),
                'lowStockCount' => $lowStockCount,
            ],
            'recentProducts' => Product::with(['category', 'mainImage'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
