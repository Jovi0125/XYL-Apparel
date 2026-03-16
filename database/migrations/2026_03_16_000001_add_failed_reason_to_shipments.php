<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->string('failed_reason')->nullable()->after('notes');
            $table->unsignedTinyInteger('delivery_attempts')->default(0)->after('failed_reason');
        });
    }

    public function down(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->dropColumn(['failed_reason', 'delivery_attempts']);
        });
    }
};
