<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $user = Auth::user();

        $stats = [
            'total_orders' => Order::where('customer_id', $user->id)->count(),
            'pending_orders' => Order::where('customer_id', $user->id)
                ->where('order_status', 'pending')->count(),
            'completed_orders' => Order::where('customer_id', $user->id)
                ->where('order_status', 'completed')->count(),
            'wishlist_count' => $user->wishlists()->count(),
        ];

        $recentOrders = Order::where('customer_id', $user->id)
            ->with(['sellerProfile', 'items'])
            ->latest()
            ->take(5)
            ->get();

        return view('customer.dashboard', compact('stats', 'recentOrders'));
    }
}
