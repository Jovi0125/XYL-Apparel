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
        // 1. Core Parent Categories (The Contexts)
        $parents = [
            'Women' => ['New Arrivals', 'T-Shirts', 'Dresses & Skirts', 'Innerwear', 'Accessories'],
            'Men' => ['New Arrivals', 'Shirts', 'Bottoms', 'Outerwear', 'Sport Utility'],
            'Unisex' => ['Linen', 'UV Protection', 'AIRism', 'Collaboration', 'Sustainability']
        ];

        foreach ($parents as $parentName => $children) {
            // Create the Parent Record
            $parent = Category::updateOrCreate(
                ['name' => $parentName],
                [
                    'status' => 'active', 
                    'description' => "Main $parentName category.",
                    'parent_id' => null, // Parents have no parent
                    'parent_category' => $parentName // Correctly set parent_category as one of Men, Women, or Unisex
                ]
            );

            // Create the Child Categories
            foreach ($children as $childName) {
                Category::updateOrCreate(
                    [
                        'name' => $childName, 
                        'parent_id' => $parent->id
                    ],
                    [
                        'status' => 'active', 
                        'description' => "Premium $childName for $parentName.",
                        'parent_category' => $parentName // Ensure consistency with enum
                    ]
                );
            }
        }

        $this->command->info('Category hierarchy (Parent > Child) successfully seeded.');
    }
}
