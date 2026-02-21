<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'size',
        'color',
        'price_override',
        'stock',
        'sku',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_override' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getLabelAttribute(): string
    {
        return collect([$this->size, $this->color])
            ->filter()
            ->implode(' / ');
    }
}
