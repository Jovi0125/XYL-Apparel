<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function getLowStockProducts()
    {
        return Product::with(['category', 'mainImage'])
            ->get()
            ->filter(fn($p) => $p->is_low_stock)
            ->values();
    }

    public function getInventoryOverview()
    {
        return DB::table('products')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name as category', DB::raw('count(*) as count'))
            ->whereNull('products.deleted_at')
            ->groupBy('categories.name')
            ->get();
    }
}
