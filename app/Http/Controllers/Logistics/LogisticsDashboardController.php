<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
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
            'preparing'        => Shipment::whereIn('order_id', $approvedOrderIds)->where('status', 'preparing')->count(),
            'packed'           => Shipment::whereIn('order_id', $approvedOrderIds)->where('status', 'packed')->count(),
            'out_for_delivery' => Shipment::whereIn('order_id', $approvedOrderIds)->where('status', 'out_for_delivery')->count(),
            'delivered'        => Shipment::whereIn('order_id', $approvedOrderIds)->where('status', 'delivered')->count(),
            'total'            => Shipment::whereIn('order_id', $approvedOrderIds)->count(),
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
                    'shipment_id'           => $order->shipment?->id,
                    'shipment_status'       => $order->shipment?->status ?? 'preparing',
                    'shipment_status_label' => $order->shipment?->status_label ?? 'Preparing',
                    'tracking_number'       => $order->shipment?->tracking_number,
                    'rider_id'              => $order->shipment?->rider_id,
                    'rider_name'            => $order->shipment?->rider?->name,
                    'rider_number'          => $order->shipment?->rider?->rider_number,
                    'carrier'               => $order->shipment?->carrier,
                    'shipped_at'            => $order->shipment?->shipped_at?->format('M d, Y H:i'),
                    'out_for_delivery_at'   => $order->shipment?->out_for_delivery_at?->format('M d, Y H:i'),
                    'delivered_at'          => $order->shipment?->delivered_at?->format('M d, Y H:i'),
                    'created_at'            => $order->created_at->format('M d, Y H:i'),
                    'order_date'            => $order->created_at->format('F d, Y'),
                ];
            });

        // Load available riders for the assignment dropdown
        $riders = \App\Models\User::where('role', 'rider')
            ->where('status', 'active')
            ->orderBy('name')
            ->get()
            ->map(fn($r) => [
                'id'           => $r->id,
                'name'         => $r->name,
                'rider_number' => $r->rider_number,
            ]);

        return Inertia::render('Logistics/Dashboard', [
            'stats'     => $stats,
            'shipments' => $shipments,
            'riders'    => $riders,
        ]);
    }

    /**
     * Update shipment status — logistics can only move forward:
     * preparing → shipped → in_transit → delivered
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status'   => ['required', 'in:preparing,packed'],
            'rider_id' => [
                $request->status === 'packed' ? 'required' : 'nullable',
                'exists:users,id',
            ],
            'notes'    => ['nullable', 'string', 'max:500'],
        ], [
            'rider_id.required' => 'You must assign a rider before marking the order as Ready for Pickup.',
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

        if ($request->filled('rider_id')) {
            $updateData['rider_id'] = $request->rider_id;
        }
        if ($request->filled('notes')) {
            $updateData['notes'] = $request->notes;
        }

        // Set packed_at timestamp (reuse shipped_at column) when marking as packed
        if ($request->status === 'packed' && !$shipment->shipped_at) {
            $updateData['shipped_at'] = now();
        }

        $shipment->update($updateData);

        return back()->with('success', "Order {$order->order_number} updated to: " . Shipment::STATUS_LABELS[$request->status] . '.');
    }
}
