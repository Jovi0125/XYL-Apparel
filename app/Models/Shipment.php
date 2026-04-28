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
    public const STATUS_PENDING          = 'pending';
    public const STATUS_PREPARING        = 'preparing';
    public const STATUS_PACKED           = 'packed';
    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';
    public const STATUS_DELIVERED        = 'delivered';
    public const STATUS_CANCELLED        = 'cancelled';

    public const STATUS_LABELS = [
        self::STATUS_PENDING          => 'Pending',
        self::STATUS_PREPARING        => 'Preparing',
        self::STATUS_PACKED           => 'Ready for Pickup',
        self::STATUS_OUT_FOR_DELIVERY => 'Out for Delivery',
        self::STATUS_DELIVERED        => 'Delivered',
        self::STATUS_CANCELLED        => 'Cancelled',
    ];

    /**
     * Statuses that Logistics staff can set (warehouse operations only)
     */
    public const LOGISTICS_STATUSES = [
        self::STATUS_PREPARING,
        self::STATUS_PACKED,
    ];

    /**
     * Statuses that a Rider can set (last-mile delivery)
     */
    public const RIDER_STATUSES = [
        self::STATUS_OUT_FOR_DELIVERY,
        self::STATUS_DELIVERED,
    ];

    protected $fillable = [
        'order_id',
        'rider_id',
        'tracking_number',
        'status',
        'carrier',
        'shipped_at',
        'out_for_delivery_at',
        'delivered_at',
        'notes',
    ];

    protected $casts = [
        'shipped_at'          => 'datetime',
        'out_for_delivery_at' => 'datetime',
        'delivered_at'        => 'datetime',
    ];

    protected $appends = ['status_label'];

    // ─── Relationships ───────────────────────────────────────

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
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

    public function scopeAssignedToRider($query, int $riderId)
    {
        return $query->where('rider_id', $riderId);
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', self::STATUS_DELIVERED);
    }
}
