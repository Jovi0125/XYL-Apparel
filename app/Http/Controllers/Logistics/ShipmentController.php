<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShipmentController extends Controller
{
    /**
     * List all shipments assigned to this rider.
     */
    public function index(Request $request)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile, 403, 'Logistics profile not set up.');

        // Backfill missing shipment rows for orders created before shipment auto-creation existed.
        Order::doesntHave('shipment')
            ->where('order_status', '!=', 'cancelled')
            ->with('sellerProfile')
            ->chunkById(200, function ($orders) use ($profile) {
                foreach ($orders as $order) {
                    Shipment::create([
                        'order_id' => $order->id,
                        'tracking_number' => Shipment::generateTrackingNumber(),
                        'logistics_profile_id' => $profile->id,
                        'delivery_status' => 'assigned',
                        'pickup_address' => $order->sellerProfile?->address ?: 'Seller address not available',
                        'delivery_address' => trim(($order->shipping_address ?? '') . ', ' . ($order->shipping_city ?? ''), ', '),
                        'assigned_at' => now(),
                    ]);
                }
            });

        $query = Shipment::where('logistics_profile_id', $profile->id);

        // Filter by status
        if ($status = $request->input('status')) {
            $query->where('delivery_status', $status);
        }

        // Search by tracking # or order details
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                  ->orWhere('delivery_address', 'like', "%{$search}%");
            });
        }

        $shipments = $query->with(['order.customer', 'order.sellerProfile'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('shipments'));
        }

        return view('welcome');
    }

    /**
     * Show shipment details.
     */
    public function show(Request $request, Shipment $shipment)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile || $shipment->logistics_profile_id !== $profile->id, 403);

        $shipment->load([
            'order.customer',
            'order.sellerProfile',
            'order.items.product.primaryImage',
            'trackingEvents.creator',
            'proofOfDelivery',
        ]);

        if ($request->expectsJson()) {
            return response()->json(compact('shipment'));
        }

        return view('welcome');
    }

    /**
     * Update shipment delivery status.
     */
    public function updateStatus(Request $request, Shipment $shipment)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile || $shipment->logistics_profile_id !== $profile->id, 403);

        $request->validate([
            'delivery_status' => 'required|in:picked_up,in_transit,out_for_delivery,delivered,failed',
        ]);

        $newStatus = $request->delivery_status;

        // Update shipment status and timestamps
        $data = ['delivery_status' => $newStatus];

        if ($newStatus === 'picked_up' && ! $shipment->picked_up_at) {
            $data['picked_up_at'] = now();
        }

        if ($newStatus === 'delivered' && ! $shipment->delivered_at) {
            $data['delivered_at'] = now();
            // Also update the order status to completed
            $shipment->order->update(['order_status' => 'completed', 'payment_status' => 'paid']);
        }

        $shipment->update($data);

        // Auto-create a tracking event
        $shipment->trackingEvents()->create([
            'status' => ucfirst(str_replace('_', ' ', $newStatus)),
            'location_text' => $request->input('location_text'),
            'remarks' => $request->input('remarks', 'Status updated to ' . str_replace('_', ' ', $newStatus)),
            'created_by' => Auth::id(),
        ]);

        $message = 'Shipment status updated to ' . str_replace('_', ' ', $newStatus) . '.';

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => $message]);
        }

        return back()->with('success', $message);
    }
}
