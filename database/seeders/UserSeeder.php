<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'admin@xylo.com'],
            [
                'name' => 'Xylo Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'postal_code' => '1000',
                'birthday' => '1990-01-01',
                'gender' => 'male',
                'terms_accepted' => true,
                'terms_accepted_at' => now(),
                'email_verified_at' => now(),
            ]
        );
    }
}
