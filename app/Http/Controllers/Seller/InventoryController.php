<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\InventoryLog;
use App\Http\Requests\Seller\UpdateStockRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $sellerId = $request->user()->sellerProfile->id;

        $query = ProductVariant::with('product')
            ->whereHas('product', fn($q) => $q->where('seller_profile_id', $sellerId));

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                  ->orWhereHas('product', fn($pq) => $pq->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->input('stock_filter') === 'low') {
            $query->where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 10);
        } elseif ($request->input('stock_filter') === 'out') {
            $query->where('stock_quantity', 0);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $variants = $query->latest()->get();

        if ($request->expectsJson()) {
            return response()->json(['data' => $variants]);
        }

        return view('welcome');
    }

    public function update(UpdateStockRequest $request, ProductVariant $variant)
    {
        $sellerId = $request->user()->sellerProfile->id;
        if ($variant->product->seller_profile_id !== $sellerId) {
            abort(403);
        }

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
                'change_type' => $change > 0 ? 'restock' : 'manual_adjustment',
                'quantity_before' => $oldStock,
                'quantity_after' => $newStock,
                'quantity_changed' => $change,
                'notes' => $request->notes ?? 'Seller adjustment',
            ]);
        });

        return response()->json(['message' => 'Stock updated.', 'variant' => $variant->fresh()]);
    }

    public function toggleStatus(Request $request, ProductVariant $variant)
    {
        $sellerId = $request->user()->sellerProfile->id;
        if ($variant->product->seller_profile_id !== $sellerId) {
            abort(403);
        }

        $variant->update(['status' => $variant->status === 'active' ? 'inactive' : 'active']);

        return response()->json(['message' => 'Status toggled.', 'variant' => $variant->fresh()]);
    }

    public function logs(Request $request)
    {
        $sellerId = $request->user()->sellerProfile->id;

        $logs = InventoryLog::with(['productVariant.product', 'user'])
            ->whereHas('productVariant.product', fn($q) => $q->where('seller_profile_id', $sellerId))
            ->latest()
            ->take(50)
            ->get();

        return response()->json(['data' => $logs]);
    }
}
