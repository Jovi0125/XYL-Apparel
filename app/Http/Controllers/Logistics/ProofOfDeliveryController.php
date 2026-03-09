<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\ProofOfDelivery;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProofOfDeliveryController extends Controller
{
    /**
     * Show form to upload proof of delivery.
     */
    public function create(Request $request, Shipment $shipment)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile || $shipment->logistics_profile_id !== $profile->id, 403);
        abort_if($shipment->proofOfDelivery, 400, 'Proof of delivery already submitted.');

        if ($request->expectsJson()) {
            return response()->json(compact('shipment'));
        }

        return view('welcome');
    }

    /**
     * Store the proof of delivery.
     */
    public function store(Request $request, Shipment $shipment)
    {
        $profile = Auth::user()->logisticsProfile;
        abort_if(! $profile || $shipment->logistics_profile_id !== $profile->id, 403);
        abort_if($shipment->proofOfDelivery, 400, 'Proof of delivery already submitted.');

        $request->validate([
            'photo' => 'nullable|image|max:5120',
            'signature' => 'nullable|image|max:2048',
            'receiver_name' => 'required|string|max:255',
        ]);

        $photoPath = null;
        $signaturePath = null;

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('proof-of-delivery/photos', 'public');
        }

        if ($request->hasFile('signature')) {
            $signaturePath = $request->file('signature')->store('proof-of-delivery/signatures', 'public');
        }

        ProofOfDelivery::create([
            'shipment_id' => $shipment->id,
            'photo_path' => $photoPath,
            'signature_path' => $signaturePath,
            'receiver_name' => $request->receiver_name,
            'received_at' => now(),
        ]);

        // Mark shipment as delivered if not already
        if ($shipment->delivery_status !== 'delivered') {
            $shipment->update([
                'delivery_status' => 'delivered',
                'delivered_at' => now(),
            ]);

            // Update order
            $shipment->order->update([
                'order_status' => 'completed',
                'payment_status' => 'paid',
            ]);

            // Create tracking event
            $shipment->trackingEvents()->create([
                'status' => 'Delivered',
                'remarks' => 'Package delivered. Proof of delivery submitted.',
                'created_by' => Auth::id(),
            ]);
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Proof of delivery submitted successfully.']);
        }

        return redirect()->route('logistics.shipments.show', $shipment)
            ->with('success', 'Proof of delivery submitted successfully.');
    }
}
