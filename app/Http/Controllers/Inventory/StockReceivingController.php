<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockReceivingController extends Controller
{
    public function index(): JsonResponse
    {
        $recentReceived = InventoryTransaction::with(['inventoryItem.productVariant.product', 'user'])
            ->where('type', 'received')
            ->latest()
            ->paginate(20);

        return response()->json($recentReceived);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity'           => 'required|integer|min:1',
            'reference'          => 'nullable|string|max:255',
            'notes'              => 'nullable|string|max:1000',
        ]);

        $item = InventoryItem::findOrFail($validated['inventory_item_id']);

        $transaction = InventoryTransaction::create([
            'inventory_item_id' => $validated['inventory_item_id'],
            'type'              => 'received',
            'quantity'          => $validated['quantity'],
            'reference'         => $validated['reference'] ?? null,
            'notes'             => $validated['notes'] ?? null,
            'user_id'           => auth()->id(),
        ]);

        $item->increment('quantity_on_hand', $validated['quantity']);

        return response()->json([
            'message'     => 'Stock received successfully.',
            'transaction' => $transaction->load('inventoryItem.productVariant.product'),
            'new_quantity' => $item->fresh()->quantity_on_hand,
        ], 201);
    }
}
