<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Fulfillment extends Model
{
    protected $fillable = [
        'order_id',
        'assigned_to',
        'status',
        'picked_at',
        'packed_at',
        'shipped_at',
        'delivered_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'picked_at'    => 'datetime',
            'packed_at'    => 'datetime',
            'shipped_at'   => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    // ── Relationships ──

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
