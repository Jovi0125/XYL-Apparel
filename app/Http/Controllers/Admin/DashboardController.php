<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_users' => User::where('role', 'customer')->count(),
            'total_sellers' => User::whereIn('role', ['inventory_staff', 'fulfillment_staff', 'support_staff'])->count(), // Repurposed for all staff
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'pending_sellers' => 0, // No longer applicable
            'total_revenue' => Order::where('order_status', 'completed')->sum('total'),
            'platform_fees' => Order::where('order_status', 'completed')->sum('platform_fee'),
        ];

        $recentOrders = Order::with(['customer'])
            ->latest()
            ->take(10)
            ->get();

        if ($request->expectsJson()) {
            return response()->json(compact('stats', 'recentOrders'));
        }

        return view('welcome');
    }
}
