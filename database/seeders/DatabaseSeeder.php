<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);
        
        // ── Core users ───────────────────────────────────
        User::create([
            'name' => 'Admin',
            'email' => 'admin@xylo.com',
            'password' => 'password',
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Test Seller',
            'email' => 'seller@xylo.com',
            'password' => 'password',
            'role' => 'seller',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Test Customer',
            'email' => 'customer@xylo.com',
            'password' => 'password',
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Test Courier',
            'email' => 'logistics@xylo.com',
            'password' => 'password',
            'role' => 'logistics',
            'email_verified_at' => now(),
        ]);

        // ── Seeders (order matters) ─────────────────────
        $this->call([
            SystemSettingsSeeder::class,
            CategorySeeder::class,
            SellerProfileSeeder::class,   // creates extra sellers, customers & logistics profile
            ProductSeeder::class,         // products, variants, images, discount codes
            OrderSeeder::class,           // orders, items, shipments, tracking events
        ]);
    }
}
