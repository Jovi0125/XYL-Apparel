<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with(['buyer', 'product'])->latest()->get()->map(function($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'buyer_name' => $order->buyer ? $order->buyer->name : 'N/A',
                'buyer_email' => $order->buyer ? $order->buyer->email : 'N/A',
                'product_title' => $order->product ? $order->product->title : 'N/A',
                'quantity' => $order->quantity,
                'total_amount' => $order->total_amount,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'status' => $order->payment_status === 'paid' ? 'Completed' : 'Processing', // Master Order Status
                'date' => $order->created_at->format('M d, Y h:i A'),
            ];
        });

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }
}
