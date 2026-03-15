<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockAdjustmentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'type'              => 'required|in:received,adjusted,picked,returned',
            'quantity'           => 'required|integer|not_in:0',
            'reference'          => 'nullable|string|max:255',
            'notes'              => 'nullable|string|max:1000',
        ]);

        $item = InventoryItem::findOrFail($validated['inventory_item_id']);

        // Create the transaction
        $transaction = InventoryTransaction::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        // Update quantity on hand
        $item->increment('quantity_on_hand', $validated['quantity']);

        return response()->json([
            'message'     => 'Stock adjusted successfully.',
            'transaction' => $transaction,
            'new_quantity' => $item->fresh()->quantity_on_hand,
        ], 201);
    }
}
