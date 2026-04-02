<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Modify the enum to include 'shipped' and 'delivered'
        DB::statement("ALTER TABLE orders MODIFY COLUMN order_status ENUM('pending','processing','ready_for_pickup','shipped','delivered','completed','cancelled') DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN order_status ENUM('pending','processing','ready_for_pickup','completed','cancelled') DEFAULT 'pending'");
    }
};
