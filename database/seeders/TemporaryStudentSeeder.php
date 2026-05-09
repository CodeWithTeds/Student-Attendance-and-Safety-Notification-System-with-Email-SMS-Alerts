<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class TemporaryStudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(20)->student()->create();
    }
}
