<?php

use App\Models\GradeLevel;
use App\Models\Section;
use App\Models\User;

it('allows admins to view the schedule management table', function (): void {
    $admin = User::factory()->admin()->create();
    $gradeLevel = GradeLevel::create([
        'name' => 'Grade 6',
        'code' => 'G6',
        'sort_order' => 6,
    ]);
    $section = Section::create([
        'grade_level_id' => $gradeLevel->id,
        'name' => 'St. Luke',
        'school_year' => '2026-2027',
    ]);
    $section->schedule()->create([
        'time_in' => '07:45',
        'time_out' => '15:45',
    ]);

    $this->actingAs($admin)
        ->get('/admin/schedules')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/schedules/index')
            ->has('sections.data', 1)
            ->where('sections.data.0.id', $section->id)
            ->where('sections.data.0.schedule.time_in_display', '07:45 AM')
        );
});

it('allows admins to save a section schedule', function (): void {
    $admin = User::factory()->admin()->create();
    $gradeLevel = GradeLevel::create([
        'name' => 'Grade 7',
        'code' => 'G7',
        'sort_order' => 7,
    ]);
    $section = Section::create([
        'grade_level_id' => $gradeLevel->id,
        'name' => 'St. Matthew',
        'school_year' => '2026-2027',
    ]);

    $this->actingAs($admin)
        ->put("/admin/sections/{$section->id}/schedule", [
            'time_in' => '07:30',
            'time_out' => '16:00',
        ])
        ->assertRedirect(route('admin.class-sections.index'));

    $this->assertDatabaseHas('section_schedules', [
        'section_id' => $section->id,
    ]);
    $section->refresh()->load('schedule');

    expect(substr($section->schedule->time_in, 0, 5))->toBe('07:30');
    expect(substr($section->schedule->time_out, 0, 5))->toBe('16:00');
});

it('allows admins to remove a section schedule', function (): void {
    $admin = User::factory()->admin()->create();
    $gradeLevel = GradeLevel::create([
        'name' => 'Grade 8',
        'code' => 'G8',
        'sort_order' => 8,
    ]);
    $section = Section::create([
        'grade_level_id' => $gradeLevel->id,
        'name' => 'St. Mark',
        'school_year' => '2026-2027',
    ]);
    $section->schedule()->create([
        'time_in' => '08:00',
        'time_out' => '15:30',
    ]);

    $this->actingAs($admin)
        ->delete("/admin/sections/{$section->id}/schedule")
        ->assertRedirect(route('admin.class-sections.index'));

    $this->assertDatabaseMissing('section_schedules', [
        'section_id' => $section->id,
    ]);
});
