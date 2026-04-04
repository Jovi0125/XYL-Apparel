<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Seed the default admin user.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@xylo.com'],
            [
                'name' => 'XYLO Admin',
                'email' => 'admin@xylo.com',
                'password' => 'password', // Will be hashed automatically via cast
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin user created: admin@xylo.com / password');
    }
}
