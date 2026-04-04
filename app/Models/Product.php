<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'short_description',
        'detailed_description',
        'category_id',
        'parent_category',
        'warranty',
        'colors',
        'sizes',
        'tags',
        'payment_methods',
        'regular_price',
        'sale_price',
        'discount_code_id',
        'stock',
        'status',
    ];

    protected $casts = [
        'colors' => 'array',
        'sizes' => 'array',
        'tags' => 'array',
        'payment_methods' => 'array',
        'regular_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function discountCode()
    {
        return $this->belongsTo(Discount::class, 'discount_code_id');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function mainImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_main', true);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getTotalStockAttribute()
    {
        if ($this->variants()->count() > 0) {
            return $this->variants()->sum('stock');
        }
        return $this->stock;
    }

    public function getFinalPriceAttribute()
    {
        return $this->sale_price ?? $this->regular_price;
    }
}
