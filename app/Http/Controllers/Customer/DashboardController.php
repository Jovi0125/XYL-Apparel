<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
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

        if ($request->expectsJson()) {
            return response()->json(compact('stats', 'recentOrders'));
        }

        return view('welcome');
    }
}
