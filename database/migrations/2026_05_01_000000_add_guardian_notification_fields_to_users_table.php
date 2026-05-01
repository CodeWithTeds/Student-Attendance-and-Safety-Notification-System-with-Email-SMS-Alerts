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
            $table->string('guardian_phone')->nullable()->after('email');
            $table->boolean('notification_sms_enabled')->default(false)->after('guardian_phone');
            $table->boolean('notification_email_enabled')->default(false)->after('notification_sms_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'guardian_phone',
                'notification_sms_enabled',
                'notification_email_enabled',
            ]);
        });
    }
};
