<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grade_level_id')->constrained()->cascadeOnDelete();
            $table->foreignId('adviser_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('school_year');
            $table->unsignedSmallInteger('capacity')->nullable();
            $table->timestamps();

            $table->unique(['grade_level_id', 'name', 'school_year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
