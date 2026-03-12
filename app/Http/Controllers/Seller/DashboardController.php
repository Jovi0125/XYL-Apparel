<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $seller = Auth::user()->sellerProfile;

        $stats = [
            'total_products' => 0,
            'total_orders' => 0,
            'pending_orders' => 0,
            'total_revenue' => 0,
        ];

        if ($seller) {
            $stats = [
                'total_products' => Product::where('seller_profile_id', $seller->id)->count(),
                'total_orders' => Order::where('seller_profile_id', $seller->id)->count(),
                'pending_orders' => Order::where('seller_profile_id', $seller->id)
                    ->where('order_status', 'pending')->count(),
                'total_revenue' => Order::where('seller_profile_id', $seller->id)
                    ->where('order_status', 'completed')->sum('total'),
            ];
        }

        if ($request->expectsJson()) {
            return response()->json(compact('stats', 'seller'));
        }

        return view('welcome');
    }
}
