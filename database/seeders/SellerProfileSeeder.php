<?php

namespace Database\Seeders;

use App\Models\LogisticsProfile;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SellerProfileSeeder extends Seeder
{
    public function run(): void
    {
        // --- Sellers & their profiles ---
        $sellers = [
            [
                'user' => ['name' => 'Test Seller', 'email' => 'seller@xylo.com'],
                'shop' => [
                    'shop_name' => 'Urban Thread Co.',
                    'bio' => 'Premium streetwear essentials crafted with quality fabrics and modern design. Based in Manila, shipping nationwide.',
                    'address' => '123 Fashion Avenue, Makati City',
                    'city' => 'Makati',
                    'phone' => '09171234567',
                    'website' => 'https://urbanthread.ph',
                    'opening_hours' => ['Mon-Fri' => '9:00 AM - 6:00 PM', 'Sat' => '10:00 AM - 4:00 PM'],
                    'status' => 'approved',
                    'commission_rate' => 10.00,
                ],
            ],
            [
                'user' => ['name' => 'Maria Santos', 'email' => 'maria@xylo.com'],
                'shop' => [
                    'shop_name' => 'Filipiniana Modern',
                    'bio' => 'Contemporary Filipino fashion blending traditional patterns with modern cuts. Proudly local, globally inspired.',
                    'address' => '456 Heritage Lane, Quezon City',
                    'city' => 'Quezon City',
                    'phone' => '09189876543',
                    'website' => 'https://filipinianamodern.com',
                    'opening_hours' => ['Mon-Sat' => '8:00 AM - 5:00 PM'],
                    'status' => 'approved',
                    'commission_rate' => 10.00,
                ],
            ],
            [
                'user' => ['name' => 'Jake Reyes', 'email' => 'jake@xylo.com'],
                'shop' => [
                    'shop_name' => 'DRIP Studio',
                    'bio' => 'Exclusive limited-edition drops and streetwear. Bold designs for those who dare to stand out.',
                    'address' => '789 Street Style Blvd, Pasig',
                    'city' => 'Pasig',
                    'phone' => '09201112233',
                    'website' => null,
                    'opening_hours' => ['Mon-Fri' => '10:00 AM - 7:00 PM'],
                    'status' => 'approved',
                    'commission_rate' => 12.00,
                ],
            ],
        ];

        foreach ($sellers as $data) {
            $user = User::where('email', $data['user']['email'])->first();

            if (! $user) {
                $user = User::create([
                    'name' => $data['user']['name'],
                    'email' => $data['user']['email'],
                    'password' => 'password',
                    'role' => 'seller',
                    'email_verified_at' => now(),
                ]);
            }

            SellerProfile::create(array_merge($data['shop'], [
                'user_id' => $user->id,
                'slug' => Str::slug($data['shop']['shop_name']),
            ]));
        }

        // --- Extra customers ---
        $customers = [
            ['name' => 'Test Customer', 'email' => 'customer@xylo.com'],
            ['name' => 'Ana Lopez', 'email' => 'ana@xylo.com'],
            ['name' => 'Carlos Tan', 'email' => 'carlos@xylo.com'],
        ];

        foreach ($customers as $c) {
            if (! User::where('email', $c['email'])->exists()) {
                User::create([
                    'name' => $c['name'],
                    'email' => $c['email'],
                    'password' => 'password',
                    'role' => 'customer',
                    'email_verified_at' => now(),
                ]);
            }
        }

        // --- Logistics profile for courier ---
        $courier = User::where('email', 'logistics@xylo.com')->first();
        if ($courier && ! LogisticsProfile::where('user_id', $courier->id)->exists()) {
            LogisticsProfile::create([
                'user_id' => $courier->id,
                'name' => 'XYLO Express Courier',
                'phone' => '09335556789',
                'service_area' => 'Metro Manila, Cavite, Laguna, Bulacan',
                'status' => 'active',
            ]);
        }
    }
}
