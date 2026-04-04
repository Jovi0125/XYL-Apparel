<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class StockService
{
    /**
     * Default stock thresholds if none exist in settings table.
     */
    protected const DEFAULT_CRITICAL = 5;
    protected const DEFAULT_LOW = 15;

    /**
     * Get the stock status data based on a quantity.
     *
     * @param int|float $stock
     * @param int|null $capacity
     * @return array
     */
    public function getStockStatus($stock, $capacity = null)
    {
        $thresholds = $this->getThresholds();
        $statusArr = $this->calculateStatus($stock, $thresholds);

        $data = [
            'status' => $statusArr['label'],
            'color' => $statusArr['color'],
            'badge_style' => $statusArr['badge_style'],
            'stock' => $stock,
            'thresholds' => $thresholds,
            'percentage' => $capacity ? round(($stock / $capacity) * 100, 1) : null,
        ];

        return $data;
    }

    /**
     * Get stock thresholds from settings or defaults.
     *
     * @return array
     */
    public function getThresholds()
    {
        // Try to fetch from table if exists
        try {
            if (\Schema::hasTable('settings')) {
                $settings = DB::table('settings')->pluck('value', 'key');
                return [
                    'critical' => (int) ($settings['critical_stock_threshold'] ?? self::DEFAULT_CRITICAL),
                    'low' => (int) ($settings['low_stock_threshold'] ?? self::DEFAULT_LOW),
                ];
            }
        } catch (\Exception $e) {
            // Log or ignore if table is missing during initial run
        }

        return [
            'critical' => self::DEFAULT_CRITICAL,
            'low' => self::DEFAULT_LOW,
        ];
    }

    /**
     * Calculate labels and colors based on stock levels.
     *
     * @param int|float $stock
     * @param array $thresholds
     * @return array
     */
    protected function calculateStatus($stock, $thresholds)
    {
        if ($stock <= 0) {
            return [
                'label' => 'Out of Stock',
                'color' => 'bg-rose-500',
                'badge_style' => 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            ];
        }

        if ($stock <= $thresholds['critical']) {
            return [
                'label' => 'Critical',
                'color' => 'bg-rose-500',
                'badge_style' => 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            ];
        }

        if ($stock <= $thresholds['low']) {
            return [
                'label' => 'Low Stock',
                'color' => 'bg-amber-500', 
                'badge_style' => 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            ];
        }

        return [
            'label' => 'Healthy',
            'color' => 'bg-emerald-500',
            'badge_style' => 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        ];
    }
}
