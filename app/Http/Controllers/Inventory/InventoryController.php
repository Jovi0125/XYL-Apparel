<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = InventoryItem::with(['productVariant.product', 'warehouse']);

        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        if ($request->boolean('low_stock')) {
            $query->whereColumn('quantity_on_hand', '<=', 'reorder_level');
        }

        if ($request->filled('search')) {
            $query->whereHas('productVariant.product', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        $items = $query->paginate(20);

        return response()->json($items);
    }

    public function show(InventoryItem $inventoryItem): JsonResponse
    {
        $inventoryItem->load(['productVariant.product', 'warehouse', 'transactions.user']);

        return response()->json($inventoryItem);
    }

    public function update(Request $request, InventoryItem $inventoryItem): JsonResponse
    {
        $validated = $request->validate([
            'reorder_level' => 'sometimes|integer|min:0',
        ]);

        $inventoryItem->update($validated);

        return response()->json($inventoryItem);
    }
}
