<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Branding
            ['key' => 'site_name', 'value' => 'Xylo Apparel', 'group' => 'branding'],
            ['key' => 'site_tagline', 'value' => 'Minimal Style. Maximum Impact.', 'group' => 'branding'],
            ['key' => 'site_logo', 'value' => null, 'group' => 'branding'],
            ['key' => 'site_banner', 'value' => null, 'group' => 'branding'],

            // Platform
            ['key' => 'default_commission_rate', 'value' => '10.00', 'group' => 'platform'],
            ['key' => 'currency', 'value' => 'PHP', 'group' => 'platform'],
            ['key' => 'currency_symbol', 'value' => '₱', 'group' => 'platform'],

            // Shipping
            ['key' => 'default_shipping_fee', 'value' => '50.00', 'group' => 'shipping'],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
