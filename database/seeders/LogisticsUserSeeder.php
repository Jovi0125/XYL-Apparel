<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LogisticsUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 2 logistics accounts for development
        // Logistics accounts are staff-only and created via seeder or internal admin portal
        $accounts = [
            ['name' => 'Logistics Team A', 'email' => 'logistics@xylo.com'],
            ['name' => 'Logistics Handler', 'email' => 'handler@xylo.com'],
        ];

        foreach ($accounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => 'password', // Automatically hashed via cast
                    'role' => User::ROLE_LOGISTICS,
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('Logistics accounts created for development.');
    }
}
