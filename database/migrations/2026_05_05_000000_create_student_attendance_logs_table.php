<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_attendance_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('qr_code_value');
            $table->string('event_type');
            $table->timestamp('scanned_at');
            $table->timestamps();

            $table->index(['user_id', 'scanned_at']);
            $table->index(['qr_code_value', 'scanned_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_attendance_logs');
    }
};
