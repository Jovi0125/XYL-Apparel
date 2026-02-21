<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SellerProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'shop_name',
        'slug',
        'bio',
        'logo',
        'banner',
        'address',
        'city',
        'phone',
        'website',
        'opening_hours',
        'status',
        'commission_rate',
    ];

    protected function casts(): array
    {
        return [
            'opening_hours' => 'array',
            'commission_rate' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function discountCodes()
    {
        return $this->hasMany(DiscountCode::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
