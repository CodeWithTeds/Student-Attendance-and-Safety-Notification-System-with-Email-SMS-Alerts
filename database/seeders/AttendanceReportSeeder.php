<?php

namespace Database\Seeders;

use App\Enums\AttendanceEventType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\GradeLevel;
use App\Models\Section;
use App\Models\StudentAttendanceLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttendanceReportSeeder extends Seeder
{
    /**
     * Seed realistic attendance data so all 5 report charts have visible data:
     *
     * - 4 grade levels, 2 sections each
     * - 30 students spread across sections
     * - 90 days of attendance logs (check-in + check-out per school day)
     */
    public function run(): void
    {
        $this->command->info('Seeding attendance report demo data...');

        // ── 1. Grade Levels ────────────────────────────────────────────────
        $gradeLevelNames = [
            ['name' => 'First Year',     'code' => '1Y'],
            ['name' => 'Second Year',    'code' => '2Y'],
            ['name' => 'Third Year',     'code' => '3Y'],
            ['name' => 'Fourth Year',    'code' => '4Y'],

        ];
        $gradeLevels = [];

        foreach ($gradeLevelNames as $i => $level) {
            $gradeLevels[] = GradeLevel::firstOrCreate(
                ['name' => $level['name']],
                ['code' => $level['code'], 'sort_order' => $i + 1]
            );
        }

        $this->command->info('Grade levels ready.');

        // ── 2. Sections (2 per grade level) ───────────────────────────────
        $sectionLetters = ['A', 'B'];
        $sections = [];

        foreach ($gradeLevels as $gradeLevel) {
            foreach ($sectionLetters as $letter) {
                $sections[] = Section::firstOrCreate(
                    [
                        'grade_level_id' => $gradeLevel->id,
                        'name'           => "Section {$letter}",
                    ],
                    [
                        'school_year' => '2025-2026',
                        'capacity'    => 40,
                    ]
                );
            }
        }

        $this->command->info('Sections ready (' . count($sections) . ' total).');

        // ── 3. Students (30 spread across sections) ────────────────────────
        $students = User::where('role', UserRole::STUDENT->value)
            ->where('status', UserStatus::APPROVED->value)
            ->take(30)
            ->get();

        // Create more if not enough
        if ($students->count() < 30) {
            $needed = 30 - $students->count();
            $this->command->info("Creating {$needed} additional student(s)...");

            User::factory()->count($needed)->student()->create();

            $students = User::where('role', UserRole::STUDENT->value)
                ->where('status', UserStatus::APPROVED->value)
                ->take(30)
                ->get();
        }

        // Assign students to sections (round-robin)
        $sectionCount = count($sections);
        foreach ($students as $i => $student) {
            $section = $sections[$i % $sectionCount];
            // Avoid duplicate pivot rows (student can only be in one section)
            if (! DB::table('section_student')
                ->where('student_id', $student->id)
                ->exists()) {
                $section->students()->attach($student->id);
            }
        }

        $this->command->info('Students assigned to sections.');

        // ── 4. Attendance logs — last 90 days, Mon–Fri only ───────────────
        $existingCount = StudentAttendanceLog::count();
        if ($existingCount > 0) {
            $this->command->warn("Skipping attendance logs — {$existingCount} already exist.");
            return;
        }

        $this->command->info('Generating attendance logs from April 1 to May 30, 2026...');

        $startDate = Carbon::create(2026, 4, 1);
        $endDate   = Carbon::create(2026, 5, 30);
        $logs      = [];

        for ($day = $startDate->copy(); $day->lte($endDate); $day->addDay()) {
            // Skip weekends
            if ($day->isWeekend()) {
                continue;
            }

            // Randomly skip ~10% of school days per student (absences)
            foreach ($students as $student) {
                if (rand(1, 10) === 1) {
                    continue; // absent this day
                }

                // Check-in between 06:30–08:00
                $checkIn = $day->copy()->setTime(
                    rand(6, 7),
                    rand(30, 59),
                    rand(0, 59)
                );

                // Check-out between 15:00–17:00
                $checkOut = $day->copy()->setTime(
                    rand(15, 16),
                    rand(0, 59),
                    rand(0, 59)
                );

                $logs[] = [
                    'user_id'      => $student->id,
                    'qr_code_value'=> $student->qr_code_value ?? 'QR-' . $student->id,
                    'event_type'   => AttendanceEventType::CHECK_IN->value,
                    'scanned_at'   => $checkIn,
                    'created_at'   => $checkIn,
                    'updated_at'   => $checkIn,
                ];

                // ~15% chance the student forgot to check out
                if (rand(1, 7) !== 1) {
                    $logs[] = [
                        'user_id'      => $student->id,
                        'qr_code_value'=> $student->qr_code_value ?? 'QR-' . $student->id,
                        'event_type'   => AttendanceEventType::CHECK_OUT->value,
                        'scanned_at'   => $checkOut,
                        'created_at'   => $checkOut,
                        'updated_at'   => $checkOut,
                    ];
                }
            }
        }

        // Bulk insert in chunks of 500
        foreach (array_chunk($logs, 500) as $chunk) {
            StudentAttendanceLog::insert($chunk);
        }

        $this->command->info('✓ Inserted ' . count($logs) . ' attendance log entries.');
        $this->command->info('✓ Attendance report seeder complete!');
    }
}
