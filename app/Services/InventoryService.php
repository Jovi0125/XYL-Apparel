<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function getLowStockProducts()
    {
        $thresholds = $this->stockService->getThresholds();

        return Product::with(['category', 'mainImage'])
            ->get()
            ->map(function($product) {
                $statusData = $this->stockService->getStockStatus($product->total_stock, $product->reference_stock);
                
                // Add status information to the product object
                $product->stock_statusLabel = $statusData['status'];
                $product->stock_statusColor = $statusData['color'];
                $product->stock_statusBadge = $statusData['badge_style'];
                $product->stock_percentageComputed = $statusData['percentage'];
                
                return $product;
            })
            ->filter(fn($p) => $p->total_stock <= $thresholds['low'])
            ->values();
    }

    public function getInventoryOverview()
    {
        $products = Product::with('category')->get();
        $totalItems = $products->sum('total_stock');

        $categories = $products->groupBy('category.name')
            ->map(function ($items, $categoryName) use ($totalItems) {
                $count = $items->sum('total_stock');
                return [
                    'category' => $categoryName ?: 'Uncategorized',
                    'count' => (int) $count,
                    'percentage' => $totalItems > 0 ? round(($count / $totalItems) * 100, 1) : 0,
                ];
            })
            ->values();

        return [
            'totalItems' => (int) $totalItems,
            'categories' => $categories,
            'thresholds' => $this->stockService->getThresholds(),
        ];
    }
}
