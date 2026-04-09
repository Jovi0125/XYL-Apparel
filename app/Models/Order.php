<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Payment method constants
     */
    public const PAYMENT_COD = 'cod';
    public const PAYMENT_GCASH = 'gcash';

    public const PAYMENT_METHODS = [
        self::PAYMENT_COD => 'Cash on Delivery',
        self::PAYMENT_GCASH => 'GCash',
    ];

    /**
     * Payment status constants
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_PAID = 'paid';
    public const STATUS_UNPAID = 'unpaid';
    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'order_number',
        'buyer_id',
        'product_id',
        'product_variant_label',
        'quantity',
        'unit_price',
        'total_amount',
        'earnings',
        'payment_method',
        'payment_status',
        'shipping_address',
        'contact_number',
        'notes',
    ];

    protected $casts = [
        'unit_price'    => 'decimal:2',
        'total_amount'  => 'decimal:2',
        'earnings'      => 'decimal:2',
        'quantity'      => 'integer',
    ];

    protected $appends = ['payment_method_label', 'formatted_total', 'formatted_earnings'];

    // ─── Relationships ───────────────────────────────────────

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function shipment()
    {
        return $this->hasOne(Shipment::class);
    }

    // ─── Accessors ───────────────────────────────────────────

    public function getPaymentMethodLabelAttribute(): string
    {
        return self::PAYMENT_METHODS[$this->payment_method] ?? $this->payment_method ?? 'N/A';
    }

    public function getFormattedTotalAttribute(): string
    {
        return '₱' . number_format((float) $this->total_amount, 2);
    }

    public function getFormattedEarningsAttribute(): string
    {
        return '₱' . number_format((float) $this->earnings, 2);
    }

    // ─── Helpers ─────────────────────────────────────────────

    /**
     * Generate a unique order number.
     */
    public static function generateOrderNumber(): string
    {
        $prefix = 'XYL';
        $timestamp = now()->format('ymd');
        $random = strtoupper(substr(uniqid(), -5));
        return "{$prefix}-{$timestamp}-{$random}";
    }

    // ─── Scopes ──────────────────────────────────────────────

    public function scopePaid($query)
    {
        return $query->where('payment_status', self::STATUS_PAID);
    }

    public function scopePending($query)
    {
        return $query->where('payment_status', self::STATUS_PENDING);
    }
}
