<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('qr_code_value')->nullable()->unique()->after('student_number');
            $table->longText('qr_code_svg')->nullable()->after('qr_code_value');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'qr_code_value',
                'qr_code_svg',
            ]);
        });
    }
};
