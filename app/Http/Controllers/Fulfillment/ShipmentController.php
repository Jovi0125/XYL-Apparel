<?php

namespace App\Http\Controllers\Fulfillment;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Shipment::with(['order']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $shipments = $query->latest()->paginate(20);

        return response()->json($shipments);
    }

    public function show(Shipment $shipment): JsonResponse
    {
        $shipment->load(['order', 'trackingEvents', 'proofOfDelivery']);

        return response()->json($shipment);
    }

    public function updateStatus(Request $request, Shipment $shipment): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|max:50',
        ]);

        $shipment->update($validated);

        return response()->json([
            'message'  => 'Shipment status updated.',
            'shipment' => $shipment,
        ]);
    }
}
