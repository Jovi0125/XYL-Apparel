<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ShipmentTrackingEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TrackingController extends Controller
{
    /**
     * Show form to add a tracking event to a shipment.
     */
    public function create(Request $request, Shipment $shipment)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile || $shipment->logistics_profile_id !== $profile->id, 403);
        
        $shipment->load('trackingEvents.creator');

        if ($request->expectsJson()) {
            return response()->json(compact('shipment'));
        }

        return view('welcome');
    }

    /**
     * Store a new tracking event.
     */
    public function store(Request $request, Shipment $shipment)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile || $shipment->logistics_profile_id !== $profile->id, 403);
        
        $request->validate([
            'status' => 'required|string|max:255',
            'location_text' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:1000',
        ]);

        $shipment->update([
            'delivery_status' => $request->status,
        ]);

        $event = ShipmentTrackingEvent::create([
            'shipment_id' => $shipment->id,
            'status' => $request->status,
            'location_text' => $request->location_text,
            'remarks' => $request->remarks,
            'created_by' => Auth::id(),
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true, 
                'message' => 'Tracking event added.',
                'event' => $event,
                'status' => $request->status
            ]);
        }

        return redirect()->route('logistics.shipments.show', $shipment)
            ->with('success', 'Tracking event added.');
    }
}
