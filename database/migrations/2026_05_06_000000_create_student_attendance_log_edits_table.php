<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_attendance_log_edits', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('student_attendance_log_id')->constrained()->cascadeOnDelete();
            $table->foreignId('edited_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('old_event_type');
            $table->string('new_event_type');
            $table->dateTime('old_scanned_at');
            $table->dateTime('new_scanned_at');
            $table->string('note')->nullable();
            $table->timestamps();

            $table->index(['student_attendance_log_id', 'created_at'], 'attendance_log_edits_log_created_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_attendance_log_edits');
    }
};
