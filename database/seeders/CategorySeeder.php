<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'T-Shirts & Tops',
                'description' => 'Everyday comfort meets clean design',
                'sort_order' => 1,
                'children' => [
                    ['name' => 'Graphic Tees', 'description' => 'Bold prints and statement designs'],
                    ['name' => 'Plain T-Shirts', 'description' => 'Essential solid-color basics'],
                    ['name' => 'Polo Shirts', 'description' => 'Smart casual staples'],
                    ['name' => 'Tank Tops', 'description' => 'Lightweight and breezy'],
                ],
            ],
            [
                'name' => 'Jackets & Outerwear',
                'description' => 'Layer up with modern silhouettes',
                'sort_order' => 2,
                'children' => [
                    ['name' => 'Bomber Jackets', 'description' => 'Classic streetwear essential'],
                    ['name' => 'Denim Jackets', 'description' => 'Timeless denim layering pieces'],
                    ['name' => 'Windbreakers', 'description' => 'Lightweight weather protection'],
                    ['name' => 'Hoodies', 'description' => 'Cozy pullover and zip-up styles'],
                ],
            ],
            [
                'name' => 'Pants & Bottoms',
                'description' => 'From denim to tailored fits',
                'sort_order' => 3,
                'children' => [
                    ['name' => 'Jeans', 'description' => 'Slim, straight, and relaxed fits'],
                    ['name' => 'Joggers', 'description' => 'Comfort meets street style'],
                    ['name' => 'Chinos', 'description' => 'Polished casual bottoms'],
                    ['name' => 'Shorts', 'description' => 'Warm-weather essentials'],
                ],
            ],
            [
                'name' => 'Sneakers & Footwear',
                'description' => 'Step into style',
                'sort_order' => 4,
                'children' => [
                    ['name' => 'Low-Top Sneakers', 'description' => 'Everyday versatile kicks'],
                    ['name' => 'High-Top Sneakers', 'description' => 'Statement footwear'],
                    ['name' => 'Slides & Sandals', 'description' => 'Easy slip-on comfort'],
                ],
            ],
            [
                'name' => 'Accessories',
                'description' => 'Complete the look',
                'sort_order' => 5,
                'children' => [
                    ['name' => 'Caps & Hats', 'description' => 'Top off your outfit'],
                    ['name' => 'Bags & Backpacks', 'description' => 'Carry in style'],
                    ['name' => 'Belts', 'description' => 'Functional fashion accents'],
                    ['name' => 'Socks', 'description' => 'Patterns and solids'],
                ],
            ],
            [
                'name' => 'Limited Edition',
                'description' => 'Exclusive drops & collaborations',
                'sort_order' => 6,
                'children' => [
                    ['name' => 'Collab Drops', 'description' => 'Artist and brand collaborations'],
                    ['name' => 'Seasonal Specials', 'description' => 'Limited seasonal releases'],
                ],
            ],
        ];

        foreach ($categories as $index => $cat) {
            $parent = Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'description' => $cat['description'],
                'is_active' => true,
                'sort_order' => $cat['sort_order'],
            ]);

            foreach ($cat['children'] as $childIndex => $child) {
                Category::create([
                    'parent_id' => $parent->id,
                    'name' => $child['name'],
                    'slug' => Str::slug($child['name']),
                    'description' => $child['description'],
                    'is_active' => true,
                    'sort_order' => $childIndex + 1,
                ]);
            }
        }
    }
}
