<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class OrderController extends Controller
{
    /**
     * List the customer's orders.
     */
    public function index(Request $request): View
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

        return view('customer.orders.index', compact('orders'));
    }

    /**
     * Show a single order detail with tracking.
     */
    public function show(Order $order): View
    {
        abort_if($order->customer_id !== Auth::id(), 403);

        $order->load([
            'sellerProfile',
            'items.product.primaryImage',
            'shipment.trackingEvents',
            'shipment.logisticsProfile',
            'shipment.proofOfDelivery',
        ]);

        return view('customer.orders.show', compact('order'));
    }

    /**
     * Cancel an order (only if still pending).
     */
    public function cancel(Order $order): RedirectResponse
    {
        abort_if($order->customer_id !== Auth::id(), 403);

        if ($order->order_status !== 'pending') {
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

        return back()->with('success', 'Order cancelled successfully.');
    }
}
