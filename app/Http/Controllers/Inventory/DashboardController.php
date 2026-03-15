<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalProducts   = Product::count();
        $lowStockItems   = InventoryItem::where('quantity_on_hand', '<=', DB::raw('reorder_level'))->count();
        $totalStockValue = InventoryItem::join('product_variants', 'inventory_items.product_variant_id', '=', 'product_variants.id')
            ->selectRaw('SUM(inventory_items.quantity_on_hand * product_variants.price) as total')
            ->value('total') ?? 0;
        $pendingOrders   = Order::where('status', 'pending')->count();

        return response()->json([
            'stats' => [
                'total_products'    => $totalProducts,
                'low_stock_items'   => $lowStockItems,
                'total_stock_value' => round($totalStockValue, 2),
                'pending_orders'    => $pendingOrders,
            ],
        ]);
    }
}
