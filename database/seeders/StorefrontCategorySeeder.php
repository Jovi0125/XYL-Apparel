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
        // Unified child categories for all parent sections
        $sharedChildren = [
            'New Arrivals',
            'T-Shirts',
            'Shirts',
            'Bottoms',
            'Outerwear',
            'Innerwear',
            'Dresses & Skirts',
            'Accessories',
            'Sport Utility',
            'Sale',
        ];

        $parentNames = ['Women', 'Men', 'Unisex'];

        foreach ($parentNames as $parentName) {
            // Create the Parent Record
            $parent = Category::updateOrCreate(
                ['name' => $parentName, 'parent_id' => null],
                [
                    'status' => 'active',
                    'description' => "Main $parentName category.",
                ]
            );

            // Create the same Child Categories for every parent
            foreach ($sharedChildren as $childName) {
                Category::updateOrCreate(
                    [
                        'name' => $childName,
                        'parent_id' => $parent->id,
                    ],
                    [
                        'status' => 'active',
                        'description' => "Premium $childName for $parentName.",
                        'parent_category' => strtolower($parentName),
                    ]
                );
            }
        }

        $this->command->info('Unified category hierarchy (Parent > Child) successfully seeded.');
    }
}
