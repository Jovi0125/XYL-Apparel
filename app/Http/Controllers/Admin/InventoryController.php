<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\InventoryLog;
use App\Http\Requests\Admin\UpdateStockRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductVariant::with(['product.sellerProfile']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                  ->orWhereHas('product', fn($pq) => $pq->where('name', 'like', "%{$search}%"));
            });
        }

        if ($sellerId = $request->input('seller_id')) {
            $query->whereHas('product', fn($q) => $q->where('seller_profile_id', $sellerId));
        }

        if ($request->input('stock_filter') === 'low') {
            $query->where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 10);
        } elseif ($request->input('stock_filter') === 'out') {
            $query->where('stock_quantity', 0);
        }

        $variants = $query->latest()->paginate(20)->withQueryString();

        if ($request->expectsJson()) {
            return response()->json($variants);
        }

        return view('welcome');
    }

    public function logs(Request $request)
    {
        $query = InventoryLog::with(['productVariant.product', 'user'])->latest();

        if ($type = $request->input('change_type')) {
            $query->where('change_type', $type);
        }

        $logs = $query->paginate(30)->withQueryString();

        if ($request->expectsJson()) {
            return response()->json($logs);
        }

        return view('welcome');
    }

    public function update(UpdateStockRequest $request, ProductVariant $variant)
    {
        $oldStock = $variant->stock_quantity;
        $newStock = $request->stock_quantity;
        $change = $newStock - $oldStock;

        if ($change === 0) {
            return response()->json(['message' => 'No change.', 'variant' => $variant]);
        }

        DB::transaction(function () use ($variant, $request, $oldStock, $newStock, $change) {
            $variant->update(['stock_quantity' => $newStock]);

            InventoryLog::create([
                'product_variant_id' => $variant->id,
                'user_id' => $request->user()->id,
                'change_type' => 'manual_adjustment',
                'quantity_before' => $oldStock,
                'quantity_after' => $newStock,
                'quantity_changed' => $change,
                'notes' => $request->notes ?? 'Admin adjustment',
            ]);
        });

        return response()->json(['message' => 'Stock updated by admin.', 'variant' => $variant->fresh()]);
    }
}
