<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Extend the role enum to include 'rider'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'buyer', 'logistics', 'rider') NOT NULL DEFAULT 'buyer'");

        // 2. Add rider_number column (e.g. RDR-001)
        Schema::table('users', function (Blueprint $table) {
            $table->string('rider_number', 20)->nullable()->unique()->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('rider_number');
        });

        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'buyer', 'logistics') NOT NULL DEFAULT 'buyer'");
    }
};
