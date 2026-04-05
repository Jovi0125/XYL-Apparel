<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('product_variant_label')->nullable(); // e.g. "M / Black"
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('earnings', 10, 2)->default(0); // net after fees
            $table->enum('payment_method', ['cod', 'gcash'])->default('cod');
            $table->enum('payment_status', ['pending', 'paid', 'unpaid', 'failed'])->default('pending');
            $table->text('shipping_address')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('order_number');
            $table->index('payment_status');
            $table->index('payment_method');
            $table->index('buyer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
