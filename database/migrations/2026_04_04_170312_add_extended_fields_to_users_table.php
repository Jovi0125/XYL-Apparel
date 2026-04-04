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
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable()->change();
            $table->string('postal_code')->nullable()->after('password');
            $table->date('birthday')->nullable()->after('postal_code');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('birthday');
            $table->boolean('is_subscribed')->default(false)->after('gender');
            $table->boolean('terms_accepted')->default(false)->after('is_subscribed');
            $table->timestamp('terms_accepted_at')->nullable()->after('terms_accepted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable(false)->change();
            $table->dropColumn([
                'postal_code',
                'birthday',
                'gender',
                'is_subscribed',
                'terms_accepted',
                'terms_accepted_at'
            ]);
        });
    }
};
