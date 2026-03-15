<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password');

        User::firstOrCreate([
            'email' => 'admin@xyloapparel.com'
        ], [
            'name'     => 'System Admin',
            'phone'    => '09123456780',
            'password' => $password,
            'role'     => 'admin',
        ]);

        User::firstOrCreate([
            'email' => 'customer@xyloapparel.com'
        ], [
            'name'     => 'Test Customer',
            'phone'    => '09123456781',
            'password' => $password,
            'role'     => 'customer',
        ]);

        User::firstOrCreate([
            'email' => 'inventory@xyloapparel.com'
        ], [
            'name'     => 'Inventory Manager',
            'phone'    => '09123456782',
            'password' => $password,
            'role'     => 'inventory_staff',
        ]);

        User::firstOrCreate([
            'email' => 'fulfillment@xyloapparel.com'
        ], [
            'name'     => 'Fulfillment Agent',
            'phone'    => '09123456783',
            'password' => $password,
            'role'     => 'fulfillment_staff',
        ]);

        User::firstOrCreate([
            'email' => 'support@xyloapparel.com'
        ], [
            'name'     => 'Support Specialist',
            'phone'    => '09123456784',
            'password' => $password,
            'role'     => 'support_staff',
        ]);
    }
}
