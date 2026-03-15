<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'is_banned',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_banned' => 'boolean',
        ];
    }

    // ── Role Helpers ──

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isInventoryStaff(): bool
    {
        return $this->role === 'inventory_staff';
    }

    public function isFulfillmentStaff(): bool
    {
        return $this->role === 'fulfillment_staff';
    }

    public function isSupportStaff(): bool
    {
        return $this->role === 'support_staff';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    // ── Relationships ──

    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function assignedTickets()
    {
        return $this->hasMany(SupportTicket::class, 'assigned_to');
    }

    public function assignedFulfillments()
    {
        return $this->hasMany(Fulfillment::class, 'assigned_to');
    }

    public function inventoryTransactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }
}
