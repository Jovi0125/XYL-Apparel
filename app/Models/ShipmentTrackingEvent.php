<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentTrackingEvent extends Model
{
    protected $fillable = [
        'shipment_id',
        'status',
        'location_text',
        'remarks',
        'created_by',
    ];

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
