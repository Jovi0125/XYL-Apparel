<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SellerProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SellerController extends Controller
{
    public function index(Request $request): View
    {
        $sellers = SellerProfile::with('user')
            ->when($request->search, fn ($q, $s) => $q->where('shop_name', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return view('admin.sellers.index', compact('sellers'));
    }

    public function show(SellerProfile $seller): View
    {
        $seller->load(['user', 'products', 'orders']);

        $stats = [
            'total_products' => $seller->products()->count(),
            'total_orders' => $seller->orders()->count(),
            'total_revenue' => $seller->orders()->where('order_status', 'completed')->sum('total'),
            'platform_fees' => $seller->orders()->where('order_status', 'completed')->sum('platform_fee'),
        ];

        return view('admin.sellers.show', compact('seller', 'stats'));
    }

    public function approve(SellerProfile $seller): RedirectResponse
    {
        $seller->update(['status' => 'approved']);

        return back()->with('success', "{$seller->shop_name} has been approved.");
    }

    public function ban(SellerProfile $seller): RedirectResponse
    {
        $seller->update(['status' => 'banned']);

        return back()->with('success', "{$seller->shop_name} has been banned.");
    }

    public function unban(SellerProfile $seller): RedirectResponse
    {
        $seller->update(['status' => 'approved']);

        return back()->with('success', "{$seller->shop_name} has been unbanned.");
    }
}
