<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index()
    {
        $allProducts = \App\Models\Product::with(['category', 'mainImage'])->get()->map(function($product) {
            $statusData = app(\App\Services\StockService::class)->getStockStatus($product->total_stock, $product->reference_stock);
            $product->stock_statusLabel = $statusData['status'];
            $product->stock_statusColor = $statusData['color'];
            $product->stock_statusBadge = $statusData['badge_style'];
            $product->stock_percentageComputed = $statusData['percentage'];
            return $product;
        });

        return Inertia::render('Admin/Inventory/Index', [
            'overview' => $this->inventoryService->getInventoryOverview(),
            'lowStockProducts' => $this->inventoryService->getLowStockProducts(),
            'allProducts' => $allProducts,
        ]);
    }

    public function updateThresholds(Request $request)
    {
        $request->validate([
            'critical_stock_threshold' => 'required|integer|min:0',
            'low_stock_threshold' => 'required|integer|min:0',
        ]);

        \DB::table('settings')->updateOrInsert(
            ['key' => 'critical_stock_threshold'],
            ['value' => $request->critical_stock_threshold, 'group' => 'inventory', 'updated_at' => now()]
        );

        \DB::table('settings')->updateOrInsert(
            ['key' => 'low_stock_threshold'],
            ['value' => $request->low_stock_threshold, 'group' => 'inventory', 'updated_at' => now()]
        );

        return back()->with('success', 'Thresholds updated successfully');
    }
}
