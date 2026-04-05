<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class StorefrontCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'women' => ['New Arrivals', 'T-Shirts', 'Dresses & Skirts', 'Innerwear', 'Accessories'],
            'men' => ['New Arrivals', 'Shirts', 'Bottoms', 'Outerwear', 'Sport Utility'],
            'unisex' => ['Linen', 'UV Protection', 'AIRism', 'Collaboration', 'Sustainability']
        ];

        foreach ($data as $parent => $children) {
            foreach ($children as $name) {
                Category::updateOrCreate(
                    ['name' => $name, 'parent_category' => $parent],
                    ['status' => 'active', 'description' => "Premium $name for $parent."]
                );
            }
        }
    }
}
