<?php

namespace App\Http\Controllers\Fulfillment;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ShipmentTrackingEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    public function create(Shipment $shipment): JsonResponse
    {
        $shipment->load('trackingEvents');

        return response()->json($shipment);
    }

    public function store(Request $request, Shipment $shipment): JsonResponse
    {
        $validated = $request->validate([
            'status'      => 'required|string|max:100',
            'location'    => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $event = $shipment->trackingEvents()->create($validated);

        return response()->json([
            'message' => 'Tracking event recorded.',
            'event'   => $event,
        ], 201);
    }
}
