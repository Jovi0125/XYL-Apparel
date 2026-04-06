<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
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

        // Fetch dynamic child categories grouped by parent
        $categoryGroups = \App\Models\Category::active()
            ->get()
            ->groupBy('parent_category');

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
            'categoryGroups' => $categoryGroups,
            'auth' => [
                'user' => $request->user()
            ]
        ]);
    }
}
