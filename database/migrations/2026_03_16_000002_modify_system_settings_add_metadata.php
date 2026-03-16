<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {
            $table->string('type')->default('string')->after('value');
            $table->string('label')->nullable()->after('type');
            $table->string('description')->nullable()->after('label');
            $table->boolean('is_public')->default(false)->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {
            $table->dropColumn(['type', 'label', 'description', 'is_public']);
        });
    }
};
