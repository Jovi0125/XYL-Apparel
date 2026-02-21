<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('shop_name');
            $table->string('slug')->unique();
            $table->text('bio')->nullable();
            $table->string('logo')->nullable();
            $table->string('banner')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->json('opening_hours')->nullable();
            $table->enum('status', ['pending', 'approved', 'banned'])->default('pending');
            $table->decimal('commission_rate', 5, 2)->default(10.00);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_profiles');
    }
};
