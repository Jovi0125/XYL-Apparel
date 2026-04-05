<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        // Load payments alongside their order context
        $payments = Payment::with(['order.buyer'])->latest()->get()->map(function($payment) {
            return [
                'id' => $payment->id,
                'order_number' => $payment->order ? $payment->order->order_number : 'N/A',
                'buyer_name' => ($payment->order && $payment->order->buyer) ? $payment->order->buyer->name : 'N/A',
                'amount' => $payment->amount,
                'method' => $payment->method,
                'status' => $payment->status,
                'reference_number' => $payment->reference_number,
                'paid_at' => $payment->paid_at ? $payment->paid_at->format('M d, Y h:i A') : 'N/A',
                'date' => $payment->created_at->format('M d, Y h:i A'),
            ];
        });

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments
        ]);
    }
}
