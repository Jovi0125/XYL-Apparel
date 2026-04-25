<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'parent_id',
        'parent_category',
        'description',
        'image_public_id',
        'image_url',
        'status',
    ];

    /**
     * Get the subcategories (T-Shirts, Jackets, etc.)
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Get the parent category (Women/Men/Unisex).
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get products belonging to this category.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Scope a query to only include active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to filter by parent category.
     */
    public function scopeParent($query, $parent)
    {
        return $query->where('parent_category', $parent);
    }

    /**
     * Get the category's image thumbnail URL
     */
    public function getImageThumbnailAttribute(): ?string
    {
        if ($this->image_public_id) {
            return cloudinary_url($this->image_public_id, 'product_thumbnail');
        }
        return $this->image_url;
    }
}
