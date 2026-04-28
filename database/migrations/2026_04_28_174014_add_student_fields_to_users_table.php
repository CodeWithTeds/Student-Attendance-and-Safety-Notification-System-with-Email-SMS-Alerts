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
            $table->uuid('student_id')->nullable()->unique()->after('id');
            $table->string('student_number')->nullable()->unique()->after('student_id');
            $table->string('first_name')->nullable()->after('name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('last_name')->nullable()->after('middle_name');
            $table->string('suffix')->nullable()->after('last_name');
            $table->string('gender')->nullable()->after('suffix');
            $table->date('date_of_birth')->nullable()->after('gender');
            $table->string('place_of_birth')->nullable()->after('date_of_birth');
            $table->string('nationality')->default('Filipino')->after('place_of_birth');

            // Address fields
            $table->string('house_no')->nullable()->after('nationality');
            $table->string('street')->nullable()->after('house_no');
            $table->string('barangay')->nullable()->after('street');
            $table->string('city')->nullable()->after('barangay');
            $table->string('province')->nullable()->after('city');
            $table->string('zip_code')->nullable()->after('province');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'student_id',
                'student_number',
                'first_name',
                'middle_name',
                'last_name',
                'suffix',
                'gender',
                'date_of_birth',
                'place_of_birth',
                'nationality',
                'house_no',
                'street',
                'barangay',
                'city',
                'province',
                'zip_code',
            ]);
        });
    }
};
