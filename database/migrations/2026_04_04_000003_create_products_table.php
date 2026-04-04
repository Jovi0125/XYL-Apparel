<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('short_description');
            $table->longText('detailed_description');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->enum('parent_category', ['Men', 'Women', 'Unisex']);
            $table->string('warranty')->default('No Warranty');
            $table->json('colors')->nullable();
            $table->json('sizes')->nullable();
            $table->json('tags')->nullable();
            $table->json('payment_methods')->nullable();
            $table->decimal('regular_price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->foreignId('discount_code_id')->nullable()->constrained('discounts')->nullOnDelete();
            $table->integer('stock')->default(0);
            $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
            $table->timestamps();

            $table->index('status');
            $table->index('category_id');
            $table->index('parent_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
