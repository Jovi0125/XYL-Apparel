<?php

namespace App\Http\Controllers\Fulfillment;

use App\Http\Controllers\Controller;
use App\Models\Fulfillment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FulfillmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Fulfillment::with(['order.user', 'assignee']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->boolean('my_assignments')) {
            $query->where('assigned_to', auth()->id());
        }

        $fulfillments = $query->latest()->paginate(20);

        return response()->json($fulfillments);
    }

    public function show(Fulfillment $fulfillment): JsonResponse
    {
        $fulfillment->load(['order.user', 'order.items.productVariant.product', 'assignee']);

        return response()->json($fulfillment);
    }

    public function updateStatus(Request $request, Fulfillment $fulfillment): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,picking,packing,shipped,delivered,cancelled',
            'notes'  => 'nullable|string|max:1000',
        ]);

        $timestampMap = [
            'picking'   => 'picked_at',
            'packing'   => 'packed_at',
            'shipped'   => 'shipped_at',
            'delivered' => 'delivered_at',
        ];

        $update = ['status' => $validated['status']];

        if (isset($timestampMap[$validated['status']])) {
            $update[$timestampMap[$validated['status']]] = now();
        }

        if (isset($validated['notes'])) {
            $update['notes'] = $validated['notes'];
        }

        $fulfillment->update($update);

        return response()->json([
            'message'     => 'Fulfillment status updated.',
            'fulfillment' => $fulfillment->fresh(),
        ]);
    }

    public function assign(Request $request, Fulfillment $fulfillment): JsonResponse
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $fulfillment->update(['assigned_to' => $validated['assigned_to']]);

        return response()->json([
            'message'     => 'Fulfillment assigned.',
            'fulfillment' => $fulfillment->load('assignee'),
        ]);
    }
}
