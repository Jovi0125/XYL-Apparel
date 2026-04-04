<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | Here you can configure your Cloudinary credentials and settings.
    | Get your credentials from: https://cloudinary.com/console
    |
    */

    'cloud_url' => env('CLOUDINARY_URL'),

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),

    'api_key' => env('CLOUDINARY_API_KEY'),

    'api_secret' => env('CLOUDINARY_API_SECRET'),

    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),

    'notification_url' => env('CLOUDINARY_NOTIFICATION_URL'),

    /*
    |--------------------------------------------------------------------------
    | Default Upload Options
    |--------------------------------------------------------------------------
    |
    | Default options for file uploads to Cloudinary
    |
    */

    'defaults' => [
        'folder' => 'xylo-apparel',
        'resource_type' => 'auto',
        'quality' => 'auto',
        'fetch_format' => 'auto',
    ],

    /*
    |--------------------------------------------------------------------------
    | Image Transformations
    |--------------------------------------------------------------------------
    |
    | Predefined image transformations for common use cases
    |
    */

    'transformations' => [
        'product_thumbnail' => [
            'width' => 300,
            'height' => 300,
            'crop' => 'fill',
            'gravity' => 'auto',
            'quality' => 'auto',
        ],
        'product_detail' => [
            'width' => 800,
            'height' => 800,
            'crop' => 'limit',
            'quality' => 'auto:good',
        ],
        'product_gallery' => [
            'width' => 1200,
            'height' => 1200,
            'crop' => 'limit',
            'quality' => 'auto:best',
        ],
        'avatar' => [
            'width' => 200,
            'height' => 200,
            'crop' => 'fill',
            'gravity' => 'face',
            'radius' => 'max',
        ],
        'banner' => [
            'width' => 1920,
            'height' => 600,
            'crop' => 'fill',
            'gravity' => 'auto',
        ],
    ],

];
