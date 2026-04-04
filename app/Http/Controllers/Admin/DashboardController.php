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
        $productsCount = Product::count();
        $products = Product::all();
        $lowStockCount = $products->filter(fn($p) => $p->is_low_stock)->count();

        // Calculate trends (mocked for now)
        $productTrend = 5.4; // 5.4% increase
        $alertTrend = $lowStockCount > 0 ? 2 : 0; 

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalProducts' => $productsCount,
                'totalOrders' => 0, // Placeholder
                'totalCategories' => Category::count(),
                'lowStockCount' => $lowStockCount,
                'revenue' => [
                    'value' => 0,
                    'trend' => 0,
                ],
                'orders' => [
                    'value' => 0,
                    'trend' => 0,
                ],
                'products' => [
                    'value' => $productsCount,
                    'trend' => $productTrend,
                ],
                'lowStockAlerts' => [
                    'value' => $lowStockCount,
                    'trend' => $alertTrend,
                ],
                // Charts and tables
                'salesData' => $this->getSalesData(),
                'recentOrders' => [], // Placeholder
                'customerDistribution' => [], // Placeholder
                'deviceUsage' => [
                    ['name' => 'Desktop', 'value' => 65, 'color' => '#6366f1'],
                    ['name' => 'Mobile', 'value' => 28, 'color' => '#a855f7'],
                    ['name' => 'Tablet', 'value' => 7, 'color' => '#22d3ee'],
                ],
            ],
            'recentProducts' => Product::with(['category', 'mainImage'])
                ->latest()
                ->limit(5)
                ->get(),
            'activeProducts' => Product::active()->latest()->limit(5)->get(),
            'lowStockProducts' => $products->filter(fn($p) => $p->is_low_stock)->values()->take(5),
        ]);
    }

    /**
     * Get mock sales data for the chart
     */
    private function getSalesData(): array
    {
        return [
            ['name' => 'Jan', 'value' => 4500],
            ['name' => 'Feb', 'value' => 5200],
            ['name' => 'Mar', 'value' => 4800],
            ['name' => 'Apr', 'value' => 6100],
            ['name' => 'May', 'value' => 5900],
            ['name' => 'Jun', 'value' => 7200],
            ['name' => 'Jul', 'value' => 6800],
        ];
    }
}
