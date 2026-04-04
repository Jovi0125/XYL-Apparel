<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['sizes', 'regular_price', 'sale_price']);
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn(['color', 'price']);
            $table->decimal('regular_price', 10, 2)->after('stock')->default(0);
            $table->decimal('sale_price', 10, 2)->nullable()->after('regular_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('sizes')->nullable();
            $table->decimal('regular_price', 10, 2)->nullable();
            $table->decimal('sale_price', 10, 2)->nullable();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->string('color')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->dropColumn(['regular_price', 'sale_price']);
        });
    }
};
