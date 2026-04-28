<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Shipment;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RiderDashboardController extends Controller
{
    /**
     * Show the Rider Dashboard.
     * Only shows shipments assigned to the logged-in rider that are
     * in 'packed' (ready for pickup) or 'out_for_delivery' status.
     */
    public function index(): Response
    {
        $rider = Auth::user();

        $shipments = Order::with(['product.mainImage', 'product.images', 'shipment', 'buyer'])
            ->approved()
            ->whereHas('shipment', fn($q) => $q->where('rider_id', $rider->id)
                ->whereIn('status', [Shipment::STATUS_PACKED, Shipment::STATUS_OUT_FOR_DELIVERY])
            )
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id'                    => $order->id,
                    'order_number'          => $order->order_number,
                    'buyer_name'            => $order->buyer?->name ?? 'Unknown',
                    'buyer_contact'         => $order->contact_number ?? $order->buyer?->contact_number ?? '',
                    'shipping_address'      => $order->shipping_address ?? '',
                    'notes'                 => $order->notes,
                    'product_title'         => $order->product?->title ?? 'Unknown Product',
                    'product_image'         => $order->product?->mainImage?->image_url ?? $order->product?->images?->first()?->image_url,
                    'variant_label'         => $order->product_variant_label,
                    'quantity'              => $order->quantity,
                    'total_amount'          => $order->total_amount,
                    'payment_method'        => $order->payment_method_label,
                    'payment_status'        => $order->payment_status,
                    'shipment_id'           => $order->shipment?->id,
                    'shipment_status'       => $order->shipment?->status ?? 'packed',
                    'shipment_status_label' => $order->shipment?->status_label ?? 'Ready for Pickup',
                    'tracking_number'       => $order->shipment?->tracking_number,
                    'out_for_delivery_at'   => $order->shipment?->out_for_delivery_at?->format('M d, Y H:i'),
                    'order_date'            => $order->created_at->format('F d, Y'),
                ];
            });

        $stats = [
            'packed'           => $rider->assignedShipments()->where('status', Shipment::STATUS_PACKED)->count(),
            'out_for_delivery' => $rider->assignedShipments()->where('status', Shipment::STATUS_OUT_FOR_DELIVERY)->count(),
            'delivered_today'  => $rider->assignedShipments()
                ->where('status', Shipment::STATUS_DELIVERED)
                ->whereDate('delivered_at', today())
                ->count(),
        ];

        return Inertia::render('Rider/Dashboard', [
            'stats'     => $stats,
            'shipments' => $shipments,
        ]);
    }

    /**
     * Update shipment status — Rider can only move forward:
     * packed → out_for_delivery → delivered
     */
    public function updateStatus(Request $request, Shipment $shipment)
    {
        $rider = Auth::user();

        // Ensure this shipment belongs to the authenticated rider
        if ($shipment->rider_id !== $rider->id) {
            return back()->withErrors(['error' => 'You are not assigned to this shipment.']);
        }

        $request->validate([
            'status' => ['required', 'in:out_for_delivery,delivered'],
        ]);

        $updateData = ['status' => $request->status];

        if ($request->status === 'out_for_delivery' && !$shipment->out_for_delivery_at) {
            $updateData['out_for_delivery_at'] = now();
        }

        if ($request->status === 'delivered') {
            $updateData['delivered_at'] = now();

            // Auto-mark COD payment as paid on delivery
            $order = $shipment->order;
            if ($order && $order->payment_method === 'cod') {
                $order->update(['payment_status' => 'paid']);

                Payment::updateOrCreate(
                    ['order_id' => $order->id],
                    [
                        'amount'           => $order->total_amount,
                        'method'           => 'cod',
                        'status'           => 'paid',
                        'reference_number' => 'COD-' . strtoupper($order->order_number),
                        'paid_at'          => now(),
                    ]
                );
            }
        }

        $shipment->update($updateData);

        $label = Shipment::STATUS_LABELS[$request->status] ?? $request->status;
        return back()->with('success', "Shipment updated to: {$label}.");
    }
}
