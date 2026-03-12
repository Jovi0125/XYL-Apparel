<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    private function seller()
    {
        return Auth::user()->sellerProfile;
    }

    public function index(Request $request)
    {
        $seller = $this->seller();

        $orders = Order::with('customer', 'items')
            ->where('seller_profile_id', $seller->id)
            ->when($request->search, fn ($q, $s) => $q->where('order_number', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('order_status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('orders'));
        }

        return view('welcome');
    }

    public function show(Request $request, Order $order)
    {
        $seller = $this->seller();
        abort_if($order->seller_profile_id !== $seller->id, 403);

        $order->load('customer', 'items.product', 'items.variant', 'shipment.trackingEvents');

        if ($request->expectsJson()) {
            return response()->json(compact('order'));
        }

        return view('welcome');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $seller = $this->seller();
        abort_if($order->seller_profile_id !== $seller->id, 403);

        $request->validate([
            'order_status' => ['required', 'in:processing,ready_for_pickup,cancelled'],
        ]);

        $order->update(['order_status' => $request->order_status]);

        $message = 'Order status updated to ' . ucwords(str_replace('_', ' ', $request->order_status)) . '.';

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => $message]);
        }

        return back()->with('success', $message);
    }
}
