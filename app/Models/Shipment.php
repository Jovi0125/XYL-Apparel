<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    protected $fillable = [
        'order_id',
        'tracking_number',
        'logistics_profile_id',
        'delivery_status',
        'pickup_address',
        'delivery_address',
        'assigned_at',
        'picked_up_at',
        'delivered_at',
        'notes',
        'failed_reason',
        'delivery_attempts',
    ];

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'picked_up_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function logisticsProfile()
    {
        return $this->belongsTo(LogisticsProfile::class);
    }

    public function trackingEvents()
    {
        return $this->hasMany(ShipmentTrackingEvent::class)->orderBy('created_at', 'desc');
    }

    public function proofOfDelivery()
    {
        return $this->hasOne(ProofOfDelivery::class);
    }

    public static function generateTrackingNumber(): string
    {
        return 'TRK-' . strtoupper(uniqid());
    }
}
