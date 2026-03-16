<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$products = App\Models\Product::query()
    ->where('is_active', true)
    ->whereHas('sellerProfile', fn ($q) => $q->where('status', 'approved'))
    ->get();

echo "Count: " . $products->count() . "\n";
if ($products->count() > 0) {
    echo "First product: " . $products->first()->name . "\n";
} else {
    echo "Total products in DB: " . App\Models\Product::count() . "\n";
    echo "Active products in DB: " . App\Models\Product::where('is_active', true)->count() . "\n";
}
