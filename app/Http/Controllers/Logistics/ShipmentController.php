<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShipmentController extends Controller
{
    public function index(Request $request)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile, 403, 'Logistics profile not set up.');

        $query = Shipment::where('logistics_profile_id', $profile->id);

        if ($status = $request->input('status')) {
            $query->where('delivery_status', $status);
        }

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

    public function updateStatus(Request $request, Shipment $shipment)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile || $shipment->logistics_profile_id !== $profile->id, 403);

        $request->validate([
            'delivery_status' => 'required|in:picked_up,in_transit,out_for_delivery,delivered,failed',
            'location_text' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:500',
            'failed_reason' => 'nullable|string|max:255',
            'receiver_name' => 'nullable|string|max:255',
        ]);

        $newStatus = $request->delivery_status;
        $data = ['delivery_status' => $newStatus];

        if ($newStatus === 'picked_up' && !$shipment->picked_up_at) {
            $data['picked_up_at'] = now();
        }

        if ($newStatus === 'delivered' && !$shipment->delivered_at) {
            $data['delivered_at'] = now();
            $shipment->order->update(['order_status' => 'completed', 'payment_status' => 'paid']);
        }

        if ($newStatus === 'failed') {
            $data['failed_reason'] = $request->failed_reason;
            $data['delivery_attempts'] = $shipment->delivery_attempts + 1;
        }

        $shipment->update($data);

        $shipment->trackingEvents()->create([
            'status' => ucfirst(str_replace('_', ' ', $newStatus)),
            'location_text' => $request->input('location_text'),
            'remarks' => $request->input('remarks', 'Status updated to ' . str_replace('_', ' ', $newStatus)),
            'created_by' => Auth::id(),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Status updated to ' . str_replace('_', ' ', $newStatus)]);
        }

        return back()->with('success', 'Status updated.');
    }

    public function history(Request $request)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile, 403);

        $query = Shipment::where('logistics_profile_id', $profile->id)
            ->whereIn('delivery_status', ['delivered', 'failed']);

        if ($status = $request->input('status')) {
            $query->where('delivery_status', $status);
        }

        $shipments = $query->with(['order.customer', 'proofOfDelivery'])
            ->latest('delivered_at')
            ->paginate(20)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('shipments'));
        }

        return view('welcome');
    }
}
