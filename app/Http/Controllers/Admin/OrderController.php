<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with(['customer', 'sellerProfile'])
            ->when($request->search, fn ($q, $s) => $q->where('order_number', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('order_status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('orders'));
        }

        return view('welcome');
    }

    public function show(Request $request, Order $order)
    {
        $order->load(['customer', 'sellerProfile', 'items.product', 'shipment.logisticsProfile', 'shipment.trackingEvents']);

        if ($request->expectsJson()) {
            return response()->json(compact('order'));
        }

        return view('welcome');
    }
}
