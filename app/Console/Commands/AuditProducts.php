<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Console\Command;

class AuditProducts extends Command
{
    protected $signature = 'products:audit {--fix : Auto-fix mismatched category assignments}';
    protected $description = 'Audit and optionally fix product category assignments';

    public function handle()
    {
        $products = Product::all();
        $shouldFix = $this->option('fix');
        $fixed = 0;

        $this->info("Found {$products->count()} products:");
        $this->newLine();

        foreach ($products as $product) {
            $currentCat = Category::find($product->category_id);
            $currentCatParent = $currentCat?->parent_category ?? 'N/A';
            $productParent = strtolower($product->parent_category);

            $mismatch = $currentCatParent !== 'N/A' && strtolower($currentCatParent) !== $productParent;

            $status = $mismatch ? '❌ MISMATCH' : '✅ OK';

            $this->line("  [{$product->id}] {$product->title}");
            $this->line("       Product parent_category: {$product->parent_category}");
            $this->line("       Assigned category_id: {$product->category_id} ({$currentCat?->name}) → belongs to: {$currentCatParent}");
            $this->line("       Status: {$status}");

            if ($mismatch && $shouldFix) {
                // Find the correct category with the same name under the right parent
                $correctCat = Category::where('name', $currentCat->name)
                    ->whereRaw('LOWER(parent_category) = ?', [$productParent])
                    ->whereNotNull('parent_id')
                    ->first();

                if ($correctCat) {
                    $product->category_id = $correctCat->id;
                    $product->save();
                    $fixed++;
                    $this->info("       → FIXED: Reassigned to category_id {$correctCat->id} ({$correctCat->name} under {$correctCat->parent_category})");
                } else {
                    $this->warn("       → Cannot auto-fix: No matching '{$currentCat->name}' category under '{$product->parent_category}'");
                }
            }

            $this->newLine();
        }

        if ($shouldFix) {
            $this->info("Fixed {$fixed} product(s).");
        }
    }
}
