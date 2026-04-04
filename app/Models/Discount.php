<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'value',
        'code',
        'description',
        'usage_limit',
        'times_used',
        'expires_at',
        'status',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'usage_limit' => 'integer',
        'times_used' => 'integer',
        'expires_at' => 'date',
    ];

    /**
     * Scope for active discounts
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for valid (not expired and not maxed out) discounts
     */
    public function scopeValid($query)
    {
        return $query->active()
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>=', now());
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')
                  ->orWhereRaw('times_used < usage_limit');
            });
    }

    /**
     * Check if the discount is expired
     */
    public function getIsExpiredAttribute(): bool
    {
        if (!$this->expires_at) {
            return false;
        }
        return $this->expires_at->isPast();
    }

    /**
     * Check if the discount has reached its usage limit
     */
    public function getIsMaxedOutAttribute(): bool
    {
        if (!$this->usage_limit) {
            return false;
        }
        return $this->times_used >= $this->usage_limit;
    }

    /**
     * Check if the discount is valid for use
     */
    public function getIsValidAttribute(): bool
    {
        return $this->status === 'active' && !$this->is_expired && !$this->is_maxed_out;
    }

    /**
     * Calculate discount amount for a given price
     */
    public function calculateDiscount(float $price): float
    {
        if ($this->type === 'percentage') {
            return round($price * ($this->value / 100), 2);
        }
        
        return min($this->value, $price);
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): void
    {
        $this->increment('times_used');
    }

    /**
     * Get formatted value for display
     */
    public function getFormattedValueAttribute(): string
    {
        if ($this->type === 'percentage') {
            return "{$this->value}%";
        }
        
        return "₱" . number_format($this->value, 2);
    }
}
