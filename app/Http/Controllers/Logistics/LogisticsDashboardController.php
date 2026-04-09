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
     * Display the Logistics Dashboard with real delivery stats.
     */
    public function index(Request $request): Response
    {
        $stats = [
            'pending' => Shipment::where('status', 'pending')->count(),
            'preparing' => Shipment::where('status', 'preparing')->count(),
            'in_transit' => Shipment::whereIn('status', ['shipped', 'in_transit'])->count(),
            'delivered' => Shipment::where('status', 'delivered')->count(),
            'cancelled' => Shipment::where('status', 'cancelled')->count(),
            'total' => Order::count(),
        ];

        $shipments = Order::with(['product.mainImage', 'product.images', 'shipment', 'buyer'])
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
                    'shipment_status' => $order->shipment?->status ?? 'pending',
                    'shipment_status_label' => $order->shipment?->status_label ?? 'Pending',
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
     * Update shipment status — the core action for logistics.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => ['required', 'in:pending,preparing,shipped,in_transit,delivered,cancelled'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'carrier' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $shipment = $order->shipment;

        if (!$shipment) {
            $shipment = Shipment::create([
                'order_id' => $order->id,
                'status' => $request->status,
            ]);
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
        if ($request->status === 'shipped' && !$shipment->shipped_at) {
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
