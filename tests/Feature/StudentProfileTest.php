<?php

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\GradeLevel;
use App\Models\Section;
use App\Models\SectionSchedule;
use App\Models\User;

it('allows students to view their profile and qr code', function (): void {
    $gradeLevel = GradeLevel::create([
        'name' => 'Grade 8',
        'code' => 'G8',
        'sort_order' => 8,
    ]);
    $section = Section::create([
        'grade_level_id' => $gradeLevel->id,
        'name' => 'A',
        'school_year' => '2026-2027',
        'capacity' => 40,
    ]);
    SectionSchedule::create([
        'section_id' => $section->id,
        'time_in' => '08:00:00',
        'time_out' => '16:00:00',
    ]);
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000201',
        'qr_code_value' => 'SASN-STUDENT|profile|2026000201|student@example.test',
        'qr_code_svg' => '<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>',
    ]);
    $guardian = User::factory()->parent()->create();

    $student->sections()->attach($section->id);
    $student->parents()->attach($guardian->id);

    $this->actingAs($student)
        ->get('/student/profile')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student/profile')
            ->where('student.id', $student->id)
            ->where('student.qr_code_value', 'SASN-STUDENT|profile|2026000201|student@example.test')
            ->where('student.current_section.name', 'A')
            ->where('student.current_section.schedule.time_in_display', '08:00 AM')
            ->has('student.parents', 1)
        );
});

it('prevents non-students from opening student profile', function (): void {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/student/profile')
        ->assertForbidden();
});
