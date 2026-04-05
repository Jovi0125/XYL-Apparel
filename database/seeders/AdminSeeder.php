<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed the default admin user.
     */
    public function run(): void
    {
        // Admin accounts must NOT be registerable publicly.
        // We ensure a primary admin exists via this seeder.
        User::updateOrCreate(
            ['email' => 'admin@xylo.com'],
            [
                'name' => 'XYLO Admin',
                'email' => 'admin@xylo.com',
                'password' => 'password', // Hashed via User model cast
                'role' => User::ROLE_ADMIN,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin user created/verified: admin@xylo.com / password');
    }
}
