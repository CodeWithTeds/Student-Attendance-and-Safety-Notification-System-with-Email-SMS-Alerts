<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GradeLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all existing grade levels from the database
        $gradeLevels = \App\Models\GradeLevel::all();

        if ($gradeLevels->isEmpty()) {
            $this->command->info('No grade levels found in the database. Please add some through the admin panel first.');
            return;
        }

        foreach ($gradeLevels as $gradeLevel) {
            $this->command->info("Seeding 5 students for: {$gradeLevel->name}");

            // Create 5 students for each existing grade level
            \App\Models\User::factory()->count(20)->student()->create([
                'grade_level_id' => $gradeLevel->id,
            ]);
        }
    }
}
