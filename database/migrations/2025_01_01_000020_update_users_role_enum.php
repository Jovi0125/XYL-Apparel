<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Remap old roles to new roles
        DB::table('users')->where('role', 'seller')->update(['role' => 'inventory_staff']);
        DB::table('users')->where('role', 'logistics')->update(['role' => 'fulfillment_staff']);

        // Alter the enum column
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->default('customer')->change();
        });
    }

    public function down(): void
    {
        DB::table('users')->where('role', 'inventory_staff')->update(['role' => 'seller']);
        DB::table('users')->where('role', 'fulfillment_staff')->update(['role' => 'logistics']);

        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->default('customer')->change();
        });
    }
};
