<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // Sales Analytics Core
        $revenue = Order::where('payment_status', 'paid')->sum('total_amount');
        $orderCount = Order::count();
        $paymentBreakdown = tap(Order::select('payment_method', DB::raw('count(*) as count'))
            ->groupBy('payment_method')
            ->get())->transform(function ($item) {
                return ['payment_method' => $item->payment_method, 'count' => $item->count];
            });

        // Product Performance Core
        $productPerformance = Order::join('products', 'orders.product_id', '=', 'products.id')
            ->select('products.title', DB::raw('SUM(orders.quantity) as total_sold'), DB::raw('SUM(orders.total_amount) as revenue'))
            ->groupBy('products.id', 'products.title')
            ->orderByDesc('total_sold')
            ->take(10)
            ->get();

        // Inventory Reports Core (Low stock logic based on local structure)
        $inventoryStats = [
            'out_of_stock' => Product::where('stock', '<=', 0)->count(),
            'low_stock' => Product::where('stock', '>', 0)->where('stock', '<=', 5)->count(),
        ];

        return Inertia::render('Admin/Reports/Index', [
            'analytics' => [
                'revenue' => (float) $revenue,
                'orderCount' => $orderCount,
                'paymentBreakdown' => $paymentBreakdown,
            ],
            'products' => $productPerformance,
            'inventory' => $inventoryStats,
        ]);
    }
}
