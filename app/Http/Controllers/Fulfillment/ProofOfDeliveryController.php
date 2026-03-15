<?php

namespace App\Http\Controllers\Fulfillment;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ProofOfDelivery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProofOfDeliveryController extends Controller
{
    public function create(Shipment $shipment): JsonResponse
    {
        $shipment->load('proofOfDelivery');

        return response()->json($shipment);
    }

    public function store(Request $request, Shipment $shipment): JsonResponse
    {
        $validated = $request->validate([
            'recipient_name' => 'required|string|max:255',
            'signature'      => 'nullable|string',
            'photo'          => 'nullable|image|max:5120',
            'notes'          => 'nullable|string|max:500',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('pod-photos', 'public');
        }

        $pod = $shipment->proofOfDelivery()->create($validated);

        // Mark shipment as delivered
        $shipment->update(['status' => 'delivered']);

        return response()->json([
            'message' => 'Proof of delivery recorded.',
            'pod'     => $pod,
        ], 201);
    }
}
