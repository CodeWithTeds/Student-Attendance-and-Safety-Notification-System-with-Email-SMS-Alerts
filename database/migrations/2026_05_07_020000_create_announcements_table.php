<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('message');
            $table->boolean('sms_enabled')->default(false);
            $table->boolean('email_enabled')->default(true);
            $table->string('audience_type')->default('all_guardians');
            $table->string('status')->default('sent');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
