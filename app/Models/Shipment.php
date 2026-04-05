<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    /**
     * Shipment status constants
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_PREPARING = 'preparing';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_IN_TRANSIT = 'in_transit';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_LABELS = [
        self::STATUS_PENDING     => 'Pending',
        self::STATUS_PREPARING   => 'Preparing',
        self::STATUS_SHIPPED     => 'Shipped',
        self::STATUS_IN_TRANSIT  => 'In Transit',
        self::STATUS_DELIVERED   => 'Delivered',
        self::STATUS_CANCELLED   => 'Cancelled',
    ];

    protected $fillable = [
        'order_id',
        'tracking_number',
        'status',
        'carrier',
        'shipped_at',
        'delivered_at',
        'notes',
    ];

    protected $casts = [
        'shipped_at'   => 'datetime',
        'delivered_at' => 'datetime',
    ];

    protected $appends = ['status_label'];

    // ─── Relationships ───────────────────────────────────────

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // ─── Accessors ───────────────────────────────────────────

    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->status] ?? ucfirst($this->status);
    }

    // ─── Scopes ──────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [self::STATUS_DELIVERED, self::STATUS_CANCELLED]);
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', self::STATUS_DELIVERED);
    }
}
