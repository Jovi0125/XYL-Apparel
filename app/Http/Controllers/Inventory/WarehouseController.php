<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index(): JsonResponse
    {
        $warehouses = Warehouse::withCount('inventoryItems')->get();

        return response()->json($warehouses);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'city'    => 'nullable|string|max:100',
            'state'   => 'nullable|string|max:100',
            'zip'     => 'nullable|string|max:20',
        ]);

        $warehouse = Warehouse::create($validated);

        return response()->json($warehouse, 201);
    }

    public function show(Warehouse $warehouse): JsonResponse
    {
        $warehouse->load('inventoryItems.productVariant.product');

        return response()->json($warehouse);
    }

    public function update(Request $request, Warehouse $warehouse): JsonResponse
    {
        $validated = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'address'   => 'nullable|string|max:255',
            'city'      => 'nullable|string|max:100',
            'state'     => 'nullable|string|max:100',
            'zip'       => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
        ]);

        $warehouse->update($validated);

        return response()->json($warehouse);
    }

    public function destroy(Warehouse $warehouse): JsonResponse
    {
        $warehouse->delete();

        return response()->json(['message' => 'Warehouse deleted.']);
    }
}
