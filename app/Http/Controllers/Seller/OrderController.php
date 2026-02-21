<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class OrderController extends Controller
{
    private function seller()
    {
        return Auth::user()->sellerProfile;
    }

    public function index(Request $request): View
    {
        $seller = $this->seller();

        $orders = Order::with('customer', 'items')
            ->where('seller_profile_id', $seller->id)
            ->when($request->search, fn ($q, $s) => $q->where('order_number', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('order_status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('seller.orders.index', compact('orders'));
    }

    public function show(Order $order): View
    {
        $seller = $this->seller();
        abort_if($order->seller_profile_id !== $seller->id, 403);

        $order->load('customer', 'items.product', 'items.variant', 'shipment.trackingEvents');

        return view('seller.orders.show', compact('order'));
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $seller = $this->seller();
        abort_if($order->seller_profile_id !== $seller->id, 403);

        $request->validate([
            'order_status' => ['required', 'in:processing,ready_for_pickup,cancelled'],
        ]);

        $order->update(['order_status' => $request->order_status]);

        return back()->with('success', 'Order status updated to ' . ucwords(str_replace('_', ' ', $request->order_status)) . '.');
    }
}
