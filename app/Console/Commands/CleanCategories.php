<?php

namespace App\Console\Commands;

use App\Models\Category;
use Illuminate\Console\Command;

class CleanCategories extends Command
{
    protected $signature = 'categories:clean';
    protected $description = 'Remove old categories not in the unified set';

    public function handle()
    {
        $keep = [
            'New Arrivals', 'T-Shirts', 'Shirts', 'Bottoms', 'Outerwear',
            'Innerwear', 'Dresses & Skirts', 'Accessories', 'Sport Utility', 'Sale',
            'Women', 'Men', 'Unisex',
        ];

        $toDelete = Category::whereNotIn('name', $keep)->get();

        $this->info("Found {$toDelete->count()} categories to remove:");
        foreach ($toDelete as $cat) {
            $this->line("  - {$cat->name} (parent: {$cat->parent_category}, id: {$cat->id})");
            $cat->forceDelete();
        }

        $this->info('Done. Remaining categories:');
        foreach (Category::all() as $cat) {
            $this->line("  [{$cat->id}] {$cat->name} — parent_category: {$cat->parent_category}");
        }
    }
}
