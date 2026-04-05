<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $appends = ['image_url'];

    protected $fillable = [
        'product_id',
        'image_public_id',
        'image_url', // Kept for legacy/fallback
        'is_main',
        'order',
    ];

    protected $casts = [
        'is_main' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the dynamic Cloudinary URL based on the current environment settings.
     */
    public function getImageUrlAttribute()
    {
        if ($this->image_public_id) {
            // Reconstruct URL using current cloud_name from config
            $cloudName = config('cloudinary.cloud_name');
            return "https://res.cloudinary.com/{$cloudName}/image/upload/{$this->image_public_id}";
        }

        return $this->attributes['image_url'] ?? '';
    }
}
