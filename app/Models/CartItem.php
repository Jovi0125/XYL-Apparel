<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'product_variant_id',
        'color',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    protected $appends = ['unit_price', 'line_total'];

    // ─── Relationships ───────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    // ─── Accessors ───────────────────────────────────────────

    public function getUnitPriceAttribute()
    {
        if ($this->variant) {
            return $this->variant->sale_price ?? $this->variant->regular_price;
        }
        return $this->product?->final_price ?? 0;
    }

    public function getLineTotalAttribute()
    {
        return $this->unit_price * $this->quantity;
    }
}
