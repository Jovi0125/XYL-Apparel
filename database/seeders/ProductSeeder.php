<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\DiscountCode;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\SellerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = SellerProfile::with('user')->get();
        $categories = Category::whereNotNull('parent_id')->get();

        if ($sellers->isEmpty() || $categories->isEmpty()) {
            return;
        }

        $products = [
            // === Urban Thread Co. products ===
            [
                'seller' => 'Urban Thread Co.',
                'items' => [
                    [
                        'category' => 'Graphic Tees',
                        'name' => 'Minimal Wave Tee',
                        'short_description' => 'Clean wave graphic on heavyweight cotton',
                        'description' => 'A minimal wave graphic printed on premium 220gsm heavyweight cotton. Pre-shrunk, relaxed fit. Perfect for everyday casual wear.',
                        'price' => 899.00,
                        'sale_price' => 749.00,
                        'specifications' => ['Material' => '100% Cotton, 220gsm', 'Fit' => 'Relaxed', 'Care' => 'Machine wash cold'],
                        'variants' => [
                            ['size' => 'S', 'color' => 'White', 'stock' => 15, 'sku' => 'UT-MWT-WS'],
                            ['size' => 'M', 'color' => 'White', 'stock' => 25, 'sku' => 'UT-MWT-WM'],
                            ['size' => 'L', 'color' => 'White', 'stock' => 20, 'sku' => 'UT-MWT-WL'],
                            ['size' => 'XL', 'color' => 'White', 'stock' => 10, 'sku' => 'UT-MWT-WXL'],
                            ['size' => 'M', 'color' => 'Black', 'stock' => 20, 'sku' => 'UT-MWT-BM'],
                            ['size' => 'L', 'color' => 'Black', 'stock' => 15, 'sku' => 'UT-MWT-BL'],
                        ],
                    ],
                    [
                        'category' => 'Plain T-Shirts',
                        'name' => 'Essential Box Tee',
                        'short_description' => 'Your everyday go-to basic',
                        'description' => 'The ultimate wardrobe staple. Soft ring-spun cotton with a modern boxy cut. Available in 5 neutral colors.',
                        'price' => 599.00,
                        'sale_price' => null,
                        'specifications' => ['Material' => '100% Ring-Spun Cotton', 'Fit' => 'Boxy', 'Weight' => '180gsm'],
                        'variants' => [
                            ['size' => 'S', 'color' => 'White', 'stock' => 30, 'sku' => 'UT-EBT-WS'],
                            ['size' => 'M', 'color' => 'White', 'stock' => 40, 'sku' => 'UT-EBT-WM'],
                            ['size' => 'L', 'color' => 'White', 'stock' => 35, 'sku' => 'UT-EBT-WL'],
                            ['size' => 'M', 'color' => 'Black', 'stock' => 40, 'sku' => 'UT-EBT-BM'],
                            ['size' => 'L', 'color' => 'Black', 'stock' => 30, 'sku' => 'UT-EBT-BL'],
                            ['size' => 'M', 'color' => 'Grey', 'stock' => 25, 'sku' => 'UT-EBT-GM'],
                        ],
                    ],
                    [
                        'category' => 'Bomber Jackets',
                        'name' => 'Midnight Bomber',
                        'short_description' => 'Sleek satin bomber for layered looks',
                        'description' => 'Classic MA-1 style bomber in premium satin with ribbed cuffs, collar, and hem. Interior pocket and zip closure.',
                        'price' => 2499.00,
                        'sale_price' => 1999.00,
                        'specifications' => ['Material' => 'Satin Shell, Poly Lining', 'Closure' => 'Full Zip', 'Pockets' => '2 exterior, 1 interior'],
                        'variants' => [
                            ['size' => 'M', 'color' => 'Black', 'stock' => 10, 'sku' => 'UT-MB-BM'],
                            ['size' => 'L', 'color' => 'Black', 'stock' => 12, 'sku' => 'UT-MB-BL'],
                            ['size' => 'XL', 'color' => 'Black', 'stock' => 8, 'sku' => 'UT-MB-BXL'],
                            ['size' => 'M', 'color' => 'Navy', 'stock' => 8, 'sku' => 'UT-MB-NM'],
                            ['size' => 'L', 'color' => 'Navy', 'stock' => 10, 'sku' => 'UT-MB-NL'],
                        ],
                    ],
                    [
                        'category' => 'Joggers',
                        'name' => 'Cloud Jogger',
                        'short_description' => 'Ultra-soft French terry joggers',
                        'description' => 'Made from brushed French terry for maximum comfort. Elastic waistband with drawstring, tapered fit, ribbed ankle cuffs.',
                        'price' => 1299.00,
                        'sale_price' => null,
                        'specifications' => ['Material' => 'French Terry, 320gsm', 'Fit' => 'Tapered', 'Features' => 'Drawstring, side pockets'],
                        'variants' => [
                            ['size' => 'S', 'color' => 'Heather Grey', 'stock' => 12, 'sku' => 'UT-CJ-HGS'],
                            ['size' => 'M', 'color' => 'Heather Grey', 'stock' => 20, 'sku' => 'UT-CJ-HGM'],
                            ['size' => 'L', 'color' => 'Heather Grey', 'stock' => 18, 'sku' => 'UT-CJ-HGL'],
                            ['size' => 'M', 'color' => 'Black', 'stock' => 20, 'sku' => 'UT-CJ-BM'],
                            ['size' => 'L', 'color' => 'Black', 'stock' => 15, 'sku' => 'UT-CJ-BL'],
                        ],
                    ],
                    [
                        'category' => 'Caps & Hats',
                        'name' => 'XYLO Dad Cap',
                        'short_description' => 'Embroidered logo cap',
                        'description' => 'Relaxed-fit unstructured cap with XYLO embroidery. Adjustable metal buckle strap. One size fits most.',
                        'price' => 499.00,
                        'sale_price' => null,
                        'specifications' => ['Material' => '100% Cotton Twill', 'Closure' => 'Metal Buckle', 'Size' => 'One Size'],
                        'variants' => [
                            ['size' => 'One Size', 'color' => 'Black', 'stock' => 30, 'sku' => 'UT-DC-B'],
                            ['size' => 'One Size', 'color' => 'White', 'stock' => 25, 'sku' => 'UT-DC-W'],
                            ['size' => 'One Size', 'color' => 'Khaki', 'stock' => 20, 'sku' => 'UT-DC-K'],
                        ],
                    ],
                ],
            ],

            // === Filipiniana Modern products ===
            [
                'seller' => 'Filipiniana Modern',
                'items' => [
                    [
                        'category' => 'Polo Shirts',
                        'name' => 'Barong Modern Polo',
                        'short_description' => 'Filipino-inspired polo with subtle embroidery',
                        'description' => 'A modern take on the classic barong, reimagined as a polo shirt. Features delicate jusi-inspired embroidery on the collar.',
                        'price' => 1499.00,
                        'sale_price' => 1199.00,
                        'specifications' => ['Material' => 'Cotton-Linen Blend', 'Fit' => 'Slim', 'Details' => 'Embroidered collar'],
                        'variants' => [
                            ['size' => 'S', 'color' => 'Cream', 'stock' => 10, 'sku' => 'FM-BMP-CS'],
                            ['size' => 'M', 'color' => 'Cream', 'stock' => 15, 'sku' => 'FM-BMP-CM'],
                            ['size' => 'L', 'color' => 'Cream', 'stock' => 12, 'sku' => 'FM-BMP-CL'],
                            ['size' => 'M', 'color' => 'Light Blue', 'stock' => 10, 'sku' => 'FM-BMP-LBM'],
                        ],
                    ],
                    [
                        'category' => 'Chinos',
                        'name' => 'Manila Slim Chino',
                        'short_description' => 'Tailored chinos for the modern Filipino',
                        'description' => 'Slim-fit chinos with stretch fabric for comfort. Dressy enough for the office, casual enough for weekends.',
                        'price' => 1699.00,
                        'sale_price' => null,
                        'specifications' => ['Material' => '98% Cotton, 2% Spandex', 'Fit' => 'Slim', 'Rise' => 'Mid'],
                        'variants' => [
                            ['size' => '30', 'color' => 'Khaki', 'stock' => 12, 'sku' => 'FM-MSC-K30'],
                            ['size' => '32', 'color' => 'Khaki', 'stock' => 15, 'sku' => 'FM-MSC-K32'],
                            ['size' => '34', 'color' => 'Khaki', 'stock' => 10, 'sku' => 'FM-MSC-K34'],
                            ['size' => '32', 'color' => 'Navy', 'stock' => 12, 'sku' => 'FM-MSC-N32'],
                            ['size' => '34', 'color' => 'Navy', 'stock' => 10, 'sku' => 'FM-MSC-N34'],
                        ],
                    ],
                    [
                        'category' => 'Bags & Backpacks',
                        'name' => 'Heritage Canvas Tote',
                        'short_description' => 'Handwoven accent canvas tote bag',
                        'description' => 'Durable canvas tote with handwoven Filipino textile accent. Spacious interior with interior zip pocket.',
                        'price' => 1299.00,
                        'sale_price' => 999.00,
                        'specifications' => ['Material' => 'Canvas + Handwoven Textile', 'Dimensions' => '40cm x 35cm x 12cm', 'Closure' => 'Magnetic Snap'],
                        'variants' => [
                            ['size' => 'One Size', 'color' => 'Natural', 'stock' => 20, 'sku' => 'FM-HCT-N'],
                            ['size' => 'One Size', 'color' => 'Navy', 'stock' => 15, 'sku' => 'FM-HCT-NV'],
                        ],
                    ],
                    [
                        'category' => 'Hoodies',
                        'name' => 'Baybayin Hoodie',
                        'short_description' => 'Hoodie with ancient Filipino script print',
                        'description' => 'Premium fleece hoodie featuring Baybayin script artwork. Kangaroo pocket, adjustable hood with drawstring.',
                        'price' => 1899.00,
                        'sale_price' => null,
                        'specifications' => ['Material' => '80% Cotton, 20% Polyester Fleece', 'Weight' => '360gsm', 'Fit' => 'Regular'],
                        'variants' => [
                            ['size' => 'M', 'color' => 'Black', 'stock' => 15, 'sku' => 'FM-BH-BM'],
                            ['size' => 'L', 'color' => 'Black', 'stock' => 12, 'sku' => 'FM-BH-BL'],
                            ['size' => 'XL', 'color' => 'Black', 'stock' => 8, 'sku' => 'FM-BH-BXL'],
                            ['size' => 'M', 'color' => 'White', 'stock' => 10, 'sku' => 'FM-BH-WM'],
                            ['size' => 'L', 'color' => 'White', 'stock' => 8, 'sku' => 'FM-BH-WL'],
                        ],
                    ],
                ],
            ],

            // === DRIP Studio products ===
            [
                'seller' => 'DRIP Studio',
                'items' => [
                    [
                        'category' => 'Collab Drops',
                        'name' => 'DRIP x Artist Series Tee',
                        'short_description' => 'Limited collaboration with local artists',
                        'description' => 'Part of DRIP Studio\'s ongoing collaboration with emerging Filipino artists. Each piece features unique artwork, numbered and limited to 100 units.',
                        'price' => 1999.00,
                        'sale_price' => null,
                        'specifications' => ['Material' => '100% Organic Cotton, 250gsm', 'Edition' => 'Limited 100pcs', 'Print' => 'DTG Premium'],
                        'variants' => [
                            ['size' => 'M', 'color' => 'White', 'stock' => 5, 'sku' => 'DS-ART-WM'],
                            ['size' => 'L', 'color' => 'White', 'stock' => 5, 'sku' => 'DS-ART-WL'],
                            ['size' => 'XL', 'color' => 'White', 'stock' => 3, 'sku' => 'DS-ART-WXL'],
                        ],
                    ],
                    [
                        'category' => 'Denim Jackets',
                        'name' => 'Distressed Denim Trucker',
                        'short_description' => 'Vintage-wash distressed denim jacket',
                        'description' => 'Heavy-duty 14oz raw denim, pre-distressed for a vintage look. Button closure, chest pockets, adjustable waistband tabs.',
                        'price' => 3499.00,
                        'sale_price' => 2999.00,
                        'specifications' => ['Material' => '14oz Raw Denim', 'Wash' => 'Vintage Distressed', 'Closure' => 'Buttons'],
                        'variants' => [
                            ['size' => 'M', 'color' => 'Light Wash', 'stock' => 8, 'sku' => 'DS-DDT-LWM'],
                            ['size' => 'L', 'color' => 'Light Wash', 'stock' => 10, 'sku' => 'DS-DDT-LWL'],
                            ['size' => 'XL', 'color' => 'Light Wash', 'stock' => 5, 'sku' => 'DS-DDT-LWXL'],
                        ],
                    ],
                    [
                        'category' => 'Jeans',
                        'name' => 'Raw Selvedge Slim',
                        'short_description' => 'Japanese selvedge denim, slim fit',
                        'description' => 'Crafted from Japanese selvedge denim. Raw unwashed for maximum fade potential. Slim straight fit with slight taper.',
                        'price' => 2999.00,
                        'sale_price' => null,
                        'specifications' => ['Material' => 'Japanese Selvedge Denim, 13.5oz', 'Fit' => 'Slim Straight', 'Rise' => 'Mid'],
                        'variants' => [
                            ['size' => '30', 'color' => 'Raw Indigo', 'stock' => 8, 'sku' => 'DS-RSS-RI30'],
                            ['size' => '32', 'color' => 'Raw Indigo', 'stock' => 12, 'sku' => 'DS-RSS-RI32'],
                            ['size' => '34', 'color' => 'Raw Indigo', 'stock' => 10, 'sku' => 'DS-RSS-RI34'],
                            ['size' => '36', 'color' => 'Raw Indigo', 'stock' => 6, 'sku' => 'DS-RSS-RI36'],
                        ],
                    ],
                    [
                        'category' => 'Low-Top Sneakers',
                        'name' => 'DRIP Court Classic',
                        'short_description' => 'Minimalist leather court sneaker',
                        'description' => 'Premium full-grain leather upper with vulcanized rubber sole. A clean, versatile silhouette for any outfit.',
                        'price' => 3999.00,
                        'sale_price' => 3499.00,
                        'specifications' => ['Material' => 'Full-Grain Leather', 'Sole' => 'Vulcanized Rubber', 'Insole' => 'Memory Foam'],
                        'variants' => [
                            ['size' => '40', 'color' => 'White', 'stock' => 6, 'sku' => 'DS-DCC-W40'],
                            ['size' => '41', 'color' => 'White', 'stock' => 8, 'sku' => 'DS-DCC-W41'],
                            ['size' => '42', 'color' => 'White', 'stock' => 10, 'sku' => 'DS-DCC-W42'],
                            ['size' => '43', 'color' => 'White', 'stock' => 8, 'sku' => 'DS-DCC-W43'],
                            ['size' => '42', 'color' => 'Black', 'stock' => 6, 'sku' => 'DS-DCC-B42'],
                            ['size' => '43', 'color' => 'Black', 'stock' => 5, 'sku' => 'DS-DCC-B43'],
                        ],
                    ],
                    [
                        'category' => 'Seasonal Specials',
                        'name' => 'Summer Camo Shorts',
                        'short_description' => 'Limited edition camo print shorts',
                        'description' => 'DRIP Studio exclusive summer drop. Custom camo pattern in muted tones. Elastic waistband with drawstring, mesh-lined pockets.',
                        'price' => 1499.00,
                        'sale_price' => 1199.00,
                        'specifications' => ['Material' => 'Nylon Ripstop', 'Inseam' => '7 inches', 'Features' => 'Mesh-lined pockets'],
                        'variants' => [
                            ['size' => 'S', 'color' => 'Olive Camo', 'stock' => 10, 'sku' => 'DS-SCS-OCS'],
                            ['size' => 'M', 'color' => 'Olive Camo', 'stock' => 15, 'sku' => 'DS-SCS-OCM'],
                            ['size' => 'L', 'color' => 'Olive Camo', 'stock' => 12, 'sku' => 'DS-SCS-OCL'],
                            ['size' => 'XL', 'color' => 'Olive Camo', 'stock' => 8, 'sku' => 'DS-SCS-OCXL'],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($products as $sellerProducts) {
            $seller = $sellers->firstWhere('shop_name', $sellerProducts['seller']);
            if (! $seller) continue;

            foreach ($sellerProducts['items'] as $item) {
                $category = $categories->firstWhere('name', $item['category']);
                if (! $category) continue;

                $product = Product::create([
                    'seller_profile_id' => $seller->id,
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'slug' => Str::slug($item['name']),
                    'short_description' => $item['short_description'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'sale_price' => $item['sale_price'],
                    'is_active' => true,
                    'cash_on_delivery' => true,
                    'specifications' => $item['specifications'],
                    'views_count' => rand(50, 500),
                ]);

                // Create variants
                foreach ($item['variants'] as $v) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'size' => $v['size'],
                        'color' => $v['color'],
                        'stock' => $v['stock'],
                        'sku' => $v['sku'],
                        'is_active' => true,
                    ]);
                }

                // Create placeholder image
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => 'products/placeholder.jpg',
                    'is_primary' => true,
                    'sort_order' => 1,
                ]);
            }
        }

        // --- Discount Codes ---
        $urbanThread = $sellers->firstWhere('shop_name', 'Urban Thread Co.');
        $drip = $sellers->firstWhere('shop_name', 'DRIP Studio');

        if ($urbanThread) {
            DiscountCode::create([
                'seller_profile_id' => $urbanThread->id,
                'code' => 'WELCOME20',
                'type' => 'percentage',
                'value' => 20.00,
                'min_order_amount' => 1000.00,
                'max_uses' => 100,
                'used_count' => 12,
                'starts_at' => now()->subDays(30),
                'expires_at' => now()->addDays(60),
                'is_active' => true,
            ]);

            DiscountCode::create([
                'seller_profile_id' => $urbanThread->id,
                'code' => 'FLAT100',
                'type' => 'fixed',
                'value' => 100.00,
                'min_order_amount' => 500.00,
                'max_uses' => 50,
                'used_count' => 5,
                'starts_at' => now()->subDays(10),
                'expires_at' => now()->addDays(90),
                'is_active' => true,
            ]);
        }

        if ($drip) {
            DiscountCode::create([
                'seller_profile_id' => $drip->id,
                'code' => 'DRIP10',
                'type' => 'percentage',
                'value' => 10.00,
                'min_order_amount' => 2000.00,
                'max_uses' => 200,
                'used_count' => 34,
                'starts_at' => now()->subDays(15),
                'expires_at' => now()->addDays(45),
                'is_active' => true,
            ]);
        }
    }
}
