<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add rider_id and out_for_delivery_at columns
        Schema::table('shipments', function (Blueprint $table) {
            $table->foreignId('rider_id')->nullable()->constrained('users')->nullOnDelete()->after('order_id');
            $table->timestamp('out_for_delivery_at')->nullable()->after('shipped_at');
        });

        // 2. Update status enum:
        //    Old: pending | preparing | shipped | in_transit | delivered | cancelled
        //    New: pending | preparing | packed  | out_for_delivery | delivered | cancelled
        //    Migrate existing data first, then change enum
        DB::statement("UPDATE shipments SET status = 'packed' WHERE status = 'shipped'");
        DB::statement("UPDATE shipments SET status = 'out_for_delivery' WHERE status = 'in_transit'");
        DB::statement("ALTER TABLE shipments MODIFY COLUMN status ENUM('pending','preparing','packed','out_for_delivery','delivered','cancelled') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        // Reverse status data migration
        DB::statement("ALTER TABLE shipments MODIFY COLUMN status ENUM('pending','preparing','shipped','in_transit','out_for_delivery','packed','delivered','cancelled') NOT NULL DEFAULT 'pending'");
        DB::statement("UPDATE shipments SET status = 'in_transit' WHERE status = 'out_for_delivery'");
        DB::statement("UPDATE shipments SET status = 'shipped' WHERE status = 'packed'");
        DB::statement("ALTER TABLE shipments MODIFY COLUMN status ENUM('pending','preparing','shipped','in_transit','delivered','cancelled') NOT NULL DEFAULT 'pending'");

        Schema::table('shipments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('rider_id');
            $table->dropColumn('out_for_delivery_at');
        });
    }
};
