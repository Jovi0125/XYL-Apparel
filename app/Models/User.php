<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * User Roles
     */
    public const ROLE_ADMIN     = 'admin';
    public const ROLE_BUYER     = 'buyer';
    public const ROLE_LOGISTICS = 'logistics';
    public const ROLE_RIDER     = 'rider';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'rider_number',
        'status',
        'suspended_at',
        'postal_code',
        'address',
        'contact_number',
        'birthday',
        'gender',
        'terms_accepted',
        'terms_accepted_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birthday' => 'date',
            'terms_accepted' => 'boolean',
            'terms_accepted_at' => 'datetime',
            'suspended_at' => 'datetime',
        ];
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if user is a buyer
     */
    public function isBuyer(): bool
    {
        return $this->role === self::ROLE_BUYER;
    }

    /**
     * Check if user is logistics
     */
    public function isLogistics(): bool
    {
        return $this->role === self::ROLE_LOGISTICS;
    }

    /**
     * Check if user is a delivery rider
     */
    public function isRider(): bool
    {
        return $this->role === self::ROLE_RIDER;
    }

    /**
     * Check if user is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if user is suspended/banned
     */
    public function isSuspended(): bool
    {
        return $this->status === 'suspended' || !is_null($this->suspended_at);
    }

    // ─── Relationships ───────────────────────────────────────

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'buyer_id');
    }

    public function assignedShipments()
    {
        return $this->hasMany(\App\Models\Shipment::class, 'rider_id');
    }
}
