<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $appends = ['regular_price', 'sale_price', 'total_stock', 'final_price', 'stock_percentage', 'is_low_stock'];

    protected $fillable = [
        'title',
        'short_description',
        'detailed_description',
        'category_id',
        'parent_category',
        'warranty',
        'colors',
        'tags',
        'payment_methods',
        'discount_code_id',
        'stock',
        'reference_stock',
        'status',
    ];

    protected $casts = [
        'colors' => 'array',
        'tags' => 'array',
        'payment_methods' => 'array',
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
        if ($this->variants->count() > 0) {
            return $this->variants->sum('stock');
        }
        return $this->stock ?? 0;
    }

    public function getRegularPriceAttribute()
    {
        return $this->variants->first()?->regular_price ?? 0;
    }

    public function getSalePriceAttribute()
    {
        return $this->variants->first()?->sale_price;
    }

    public function getFinalPriceAttribute()
    {
        $variant = $this->variants->first();
        if ($variant) {
            return $variant->sale_price ?? $variant->regular_price;
        }
        return 0;
    }

    public function getStockPercentageAttribute()
    {
        if (($this->reference_stock ?? 0) <= 0) return 0;
        return ($this->total_stock / $this->reference_stock) * 100;
    }

    public function getIsLowStockAttribute()
    {
        return $this->stock_percentage <= 50;
    }
}
