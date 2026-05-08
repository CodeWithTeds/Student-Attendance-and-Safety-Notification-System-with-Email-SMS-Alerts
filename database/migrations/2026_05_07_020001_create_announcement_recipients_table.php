<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcement_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announcement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('guardian_id')->constrained('users')->cascadeOnDelete();
            $table->string('sms_status')->nullable();
            $table->string('email_status')->nullable();
            $table->timestamp('sms_sent_at')->nullable();
            $table->timestamp('email_sent_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->unique(['announcement_id', 'guardian_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcement_recipients');
    }
};
