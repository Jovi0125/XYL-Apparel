<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn(['price_override', 'stock', 'is_active']);
            
            $table->unsignedInteger('stock_quantity')->default(0)->after('sku');
            $table->decimal('regular_price', 10, 2)->nullable()->after('stock_quantity');
            $table->decimal('sale_price', 10, 2)->nullable()->after('regular_price');
            $table->string('status')->default('active')->after('sale_price');
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn(['stock_quantity', 'regular_price', 'sale_price', 'status']);
            
            $table->decimal('price_override', 10, 2)->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->boolean('is_active')->default(true);
        });
    }
};
