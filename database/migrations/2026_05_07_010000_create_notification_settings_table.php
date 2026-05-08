<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_settings', function (Blueprint $table) {
            $table->id();
            $table->string('event_type')->unique();
            $table->boolean('sms_enabled')->default(false);
            $table->boolean('email_enabled')->default(true);
            $table->string('title');
            $table->text('message_template')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_settings');
    }
};
