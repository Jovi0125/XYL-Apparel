<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * List the customer's orders.
     */
    public function index(Request $request)
    {
        $query = Order::where('customer_id', Auth::id());

        // Filter by status
        if ($status = $request->input('status')) {
            $query->where('order_status', $status);
        }

        // Search by order number
        if ($search = $request->input('search')) {
            $query->where('order_number', 'like', "%{$search}%");
        }

        $orders = $query->with(['sellerProfile', 'items'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('orders'));
        }

        return view('welcome');
    }

    /**
     * Show a single order detail with tracking.
     */
    public function show(Request $request, Order $order)
    {
        abort_if($order->customer_id !== Auth::id(), 403);

        $order->load([
            'sellerProfile',
            'items.product.primaryImage',
            'shipment.trackingEvents',
            'shipment.logisticsProfile',
            'shipment.proofOfDelivery',
        ]);

        if ($request->expectsJson()) {
            return response()->json(compact('order'));
        }

        return view('welcome');
    }

    /**
     * Cancel an order (only if still pending).
     */
    public function cancel(Request $request, Order $order)
    {
        abort_if($order->customer_id !== Auth::id(), 403);

        if ($order->order_status !== 'pending') {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Only pending orders can be cancelled.'], 422);
            }
            return back()->with('error', 'Only pending orders can be cancelled.');
        }

        $order->update(['order_status' => 'cancelled']);

        // Restore stock for variants
        foreach ($order->items as $item) {
            if ($item->product_variant_id) {
                \App\Models\ProductVariant::where('id', $item->product_variant_id)
                    ->increment('stock', $item->quantity);
            }
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Order cancelled successfully.']);
        }

        return back()->with('success', 'Order cancelled successfully.');
    }
}
