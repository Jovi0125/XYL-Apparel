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
        $password = Hash::make('password123'); // Adjust default generic password logic optionally based on standard defaults.

        for ($i = 1; $i <= 5; $i++) {
            User::updateOrCreate(
                ['email' => "logistics{$i}@xylo.com"],
                [
                    'name' => "Logistics Employee {$i}",
                    'password' => $password,
                    'role' => User::ROLE_LOGISTICS,
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
