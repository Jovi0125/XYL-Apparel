<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Display the primary cinematic storefront entry.
     */
    public function index(Request $request)
    {
        // Normalize path for category matching by removing /ph/en prefix
        $pathSegments = explode('/', $request->path());
        $activeSlug = end($pathSegments);
        // Strip -navi suffix if present for normalized matching
        $activeSlug = str_replace('-navi', '', $activeSlug);
        if ($activeSlug === 'en' || $activeSlug === 'ph') $activeSlug = 'home';
        
        $storefrontConfigs = [
            [
                'slug' => 'women',
                'label' => 'WOMEN',
                'intro' => 'SS/26 COLLECTION',
                'title' => 'Ethereal Forms',
                'description' => 'A dialogue between structure and fluidity. Exploring the boundaries of modern femininity.',
                'videoSrc' => '/videos/vid2.mp4',
            ],
            [
                'slug' => 'men',
                'label' => 'MEN',
                'intro' => 'URBAN ESSENTIALS',
                'title' => 'Pure Architecture',
                'description' => 'Precision-cut silhouettes designed for the contemporary landscape.',
                'videoSrc' => '/videos/vidq.mp4',
            ],
            [
                'slug' => 'unisex',
                'label' => 'UNISEX',
                'intro' => 'FLUID IDENTITIES',
                'title' => 'The Neutral Core',
                'description' => 'Transcending gender through minimalist design and adaptive textures.',
                'videoSrc' => '/videos/vid2.mp4',
            ]
        ];

        // Fetch ONLY child categories (those with a parent_id) grouped by parent_category
        $categoryGroups = Category::active()
            ->whereNotNull('parent_id')
            ->whereNotNull('parent_category')
            ->get()
            ->groupBy('parent_category');

        // Load all products with their main image, grouped by category_id
        $productsByCategoryId = Product::with('mainImage')
            ->whereHas('mainImage')
            ->get()
            ->groupBy('category_id');

        // Build enriched category groups with product thumbnails
        $enrichedGroups = [];
        foreach ($categoryGroups as $parent => $categories) {
            $parentKey = strtolower($parent);

            $enrichedGroups[$parentKey] = $categories->map(function ($cat) use ($productsByCategoryId) {
                $catProducts = $productsByCategoryId->get($cat->id, collect());
                $representativeProduct = $catProducts->first();
                
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'description' => $cat->description,
                    'image_url' => $cat->image_url,
                    'product_image' => $representativeProduct?->mainImage?->image_url,
                    'product_count' => $catProducts->count(),
                ];
            })->values();
        }

        // Determine default active category based on active slug
        $defaultActive = $storefrontConfigs[0];
        foreach ($storefrontConfigs as $config) {
            if ($activeSlug === $config['slug']) {
                $defaultActive = $config;
                break;
            }
        }

        return Inertia::render('Storefront/Index', [
            'storefrontConfigs' => $storefrontConfigs,
            'initialActive' => $defaultActive,
            'categoryGroups' => $enrichedGroups,
            'auth' => [
                'user' => $request->user()
            ]
        ]);
    }
}
