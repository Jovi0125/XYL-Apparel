<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;

class LogisticsController extends Controller
{
    public function index()
    {
        // Fetch all shipments with their tracking events (latest first)
        $shipments = Shipment::with('trackingEvents')->orderBy('created_at', 'desc')->get();
        return view('logistics.index', compact('shipments'));
    }

    public function updateStatus(Request $request, Shipment $shipment)
    {
        $request->validate([
            'status' => 'required|string',
            'location_text' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        // Update shipment status
        $shipment->update([
            'delivery_status' => $request->status,
        ]);

        // Create tracking event
        $event = $shipment->trackingEvents()->create([
            'status' => $request->status,
            'location_text' => $request->location_text ?? 'Current Location',
            'remarks' => $request->remarks,
            // Assuming the authenticated user is the logistics updater (nullable if you don't enforce auth right now)
            'created_by' => auth()->id(), 
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully!',
            'shipment' => $shipment,
            'event' => $event
        ]);
    }
}
