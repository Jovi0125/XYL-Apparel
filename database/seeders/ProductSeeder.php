<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Categories
        $categories = ['T-Shirts', 'Jackets', 'Jeans'];
        foreach ($categories as $cat) {
            Category::updateOrCreate(['name' => $cat], ['status' => 'active']);
        }
        $catIds = Category::pluck('id')->toArray();

        // 2. Create sample products
        $products = [
            [
                'title' => 'Neon Graphic Tee',
                'short_description' => 'Bright and modern tee with neon graphics.',
                'detailed_description' => 'Premium cotton tee featuring state-of-the-art neon printing technology.',
                'category_id' => $catIds[0],
                'parent_category' => 'Men',
                'warranty' => 'No warranty',
                'stock' => 150,
            ],
            [
                'title' => 'Vintage Bomber Jacket',
                'short_description' => 'Classic retro-style bomber jacket.',
                'detailed_description' => 'Weather-resistant outer shell with soft quilted lining.',
                'category_id' => $catIds[1],
                'parent_category' => 'Unisex',
                'warranty' => '1 Year',
                'stock' => 5, // LOW STOCK ALERT
            ],
            [
                'title' => 'Slim Fit Dark Denim',
                'short_description' => 'Modern slim fit jeans in deep indigo.',
                'detailed_description' => 'Durable stretch denim designed for comfort and style.',
                'category_id' => $catIds[2],
                'parent_category' => 'Men',
                'warranty' => '6 Months',
                'stock' => 85,
            ]
        ];

        foreach ($products as $prod) {
            $p = Product::create($prod);
            
            // Add variants
            ProductVariant::create([
                'product_id' => $p->id,
                'size' => 'M',
                'stock' => $prod['stock'],
                'regular_price' => 1299.00,
                'sale_price' => 999.00
            ]);
        }
    }
}
