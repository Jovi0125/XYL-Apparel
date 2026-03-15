<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = [
        'product_variant_id',
        'warehouse_id',
        'quantity_on_hand',
        'quantity_reserved',
        'reorder_level',
    ];

    // ── Relationships ──

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    // ── Helpers ──

    public function availableQuantity(): int
    {
        return $this->quantity_on_hand - $this->quantity_reserved;
    }

    public function isLowStock(): bool
    {
        return $this->quantity_on_hand <= $this->reorder_level;
    }
}
