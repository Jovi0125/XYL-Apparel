<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shipment;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogisticsDashboardController extends Controller
{
    /**
     * Display the Fulfillment Center dashboard.
     * Only shows orders that have been approved by admin.
     */
    public function index(Request $request): Response
    {
        // Only count shipments for approved orders
        $approvedOrderIds = Order::approved()->pluck('id');

        $stats = [
            'preparing'  => Shipment::whereIn('order_id', $approvedOrderIds)->where('status', 'preparing')->count(),
            'in_transit' => Shipment::whereIn('order_id', $approvedOrderIds)->whereIn('status', ['shipped', 'in_transit'])->count(),
            'delivered'  => Shipment::whereIn('order_id', $approvedOrderIds)->where('status', 'delivered')->count(),
            'total'      => Shipment::whereIn('order_id', $approvedOrderIds)->count(),
        ];

        $shipments = Order::with(['product.mainImage', 'product.images', 'shipment', 'buyer'])
            ->approved()
            ->whereHas('shipment')
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'buyer_name' => $order->buyer?->name ?? 'Unknown',
                    'buyer_email' => $order->buyer?->email ?? '',
                    'buyer_contact' => $order->buyer?->contact_number ?? '',
                    'buyer_address' => $order->buyer?->address ?? '',
                    'product_title' => $order->product?->title ?? 'Unknown Product',
                    'product_image' => $order->product?->mainImage?->image_url ?? $order->product?->images?->first()?->image_url,
                    'variant_label' => $order->product_variant_label,
                    'quantity' => $order->quantity,
                    'unit_price' => $order->unit_price,
                    'total_amount' => $order->total_amount,
                    'payment_method' => $order->payment_method_label,
                    'payment_status' => $order->payment_status,
                    'shipping_address' => $order->shipping_address,
                    'contact_number' => $order->contact_number,
                    'notes' => $order->notes,
                    'shipment_id' => $order->shipment?->id,
                    'shipment_status' => $order->shipment?->status ?? 'preparing',
                    'shipment_status_label' => $order->shipment?->status_label ?? 'Preparing',
                    'tracking_number' => $order->shipment?->tracking_number,
                    'carrier' => $order->shipment?->carrier,
                    'shipped_at' => $order->shipment?->shipped_at?->format('M d, Y H:i'),
                    'delivered_at' => $order->shipment?->delivered_at?->format('M d, Y H:i'),
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                    'order_date' => $order->created_at->format('F d, Y'),
                ];
            });

        return Inertia::render('Logistics/Dashboard', [
            'stats' => $stats,
            'shipments' => $shipments,
        ]);
    }

    /**
     * Update shipment status — logistics can only move forward:
     * preparing → in_transit → delivered
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => ['required', 'in:preparing,in_transit,delivered'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'carrier' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        // Ensure order is approved
        if ($order->order_status !== 'approved') {
            return back()->withErrors(['error' => 'Only approved orders can be updated.']);
        }

        $shipment = $order->shipment;

        if (!$shipment) {
            return back()->withErrors(['error' => 'No shipment found for this order.']);
        }

        $updateData = ['status' => $request->status];

        if ($request->filled('tracking_number')) {
            $updateData['tracking_number'] = $request->tracking_number;
        }
        if ($request->filled('carrier')) {
            $updateData['carrier'] = $request->carrier;
        }
        if ($request->filled('notes')) {
            $updateData['notes'] = $request->notes;
        }

        // Set timestamps based on status
        if ($request->status === 'in_transit' && !$shipment->shipped_at) {
            $updateData['shipped_at'] = now();
        }
        if ($request->status === 'delivered') {
            $updateData['delivered_at'] = now();
            // Auto-mark payment as paid on delivery (for COD)
            if ($order->payment_method === 'cod') {
                $order->update(['payment_status' => 'paid']);
            }
        }

        $shipment->update($updateData);

        return back()->with('success', "Order {$order->order_number} status updated to {$request->status}.");
    }
}
