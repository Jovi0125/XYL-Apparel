<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SellerProfile;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    public function index(Request $request)
    {
        $sellers = SellerProfile::with('user')
            ->when($request->search, fn ($q, $s) => $q->where('shop_name', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('sellers'));
        }

        return view('welcome');
    }

    public function show(Request $request, SellerProfile $seller)
    {
        $seller->load(['user', 'products', 'orders']);

        $stats = [
            'total_products' => $seller->products()->count(),
            'total_orders' => $seller->orders()->count(),
            'total_revenue' => $seller->orders()->where('order_status', 'completed')->sum('total'),
            'platform_fees' => $seller->orders()->where('order_status', 'completed')->sum('platform_fee'),
        ];

        if ($request->expectsJson()) {
            return response()->json(compact('seller', 'stats'));
        }

        return view('welcome');
    }

    public function approve(Request $request, SellerProfile $seller)
    {
        $seller->update(['status' => 'approved']);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => "{$seller->shop_name} has been approved."]);
        }

        return back()->with('success', "{$seller->shop_name} has been approved.");
    }

    public function ban(Request $request, SellerProfile $seller)
    {
        $seller->update(['status' => 'banned']);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => "{$seller->shop_name} has been banned."]);
        }

        return back()->with('success', "{$seller->shop_name} has been banned.");
    }

    public function unban(Request $request, SellerProfile $seller)
    {
        $seller->update(['status' => 'approved']);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => "{$seller->shop_name} has been unbanned."]);
        }

        return back()->with('success', "{$seller->shop_name} has been unbanned.");
    }
}
