<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_users' => User::where('role', 'customer')->count(),
            'total_sellers' => User::where('role', 'seller')->count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'pending_sellers' => SellerProfile::where('status', 'pending')->count(),
            'total_revenue' => Order::where('order_status', 'completed')->sum('total'),
            'platform_fees' => Order::where('order_status', 'completed')->sum('platform_fee'),
        ];

        $recentOrders = Order::with(['customer', 'sellerProfile'])
            ->latest()
            ->take(10)
            ->get();

        if ($request->expectsJson()) {
            return response()->json(compact('stats', 'recentOrders'));
        }

        return view('welcome');
    }
}
