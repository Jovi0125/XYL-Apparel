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
        // Seed exactly 5 logistics accounts as per requirements
        for ($i = 1; $i <= 5; $i++) {
            User::updateOrCreate(
                ['email' => "logistics{$i}@xylo.com"],
                [
                    'name' => "Logistics Handler {$i}",
                    'password' => 'password', // Automatically hashed via User model cast
                    'role' => User::ROLE_LOGISTICS,
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('5 Logistics accounts successfully seeded/updated.');
    }
}
