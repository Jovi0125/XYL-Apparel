<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ShipmentTrackingEvent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class TrackingController extends Controller
{
    /**
     * Show form to add a tracking event to a shipment.
     */
    public function create(Shipment $shipment): View
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile || $shipment->logistics_profile_id !== $profile->id, 403);

        $shipment->load('trackingEvents.creator');

        return view('logistics.tracking.create', compact('shipment'));
    }

    /**
     * Store a new tracking event.
     */
    public function store(Request $request, Shipment $shipment): RedirectResponse
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile || $shipment->logistics_profile_id !== $profile->id, 403);

        $request->validate([
            'status' => 'required|string|max:255',
            'location_text' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:1000',
        ]);

        ShipmentTrackingEvent::create([
            'shipment_id' => $shipment->id,
            'status' => $request->status,
            'location_text' => $request->location_text,
            'remarks' => $request->remarks,
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('logistics.shipments.show', $shipment)
            ->with('success', 'Tracking event added.');
    }
}
