<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
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

        return view('seller.dashboard', compact('stats', 'seller'));
    }
}
