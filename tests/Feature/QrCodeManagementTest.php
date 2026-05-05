<?php

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;

it('allows admins to view approved students for qr code management', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000101',
    ]);

    $this->actingAs($admin)
        ->get('/admin/qr-codes')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/qr-codes/index')
            ->has('students.data', 1)
            ->where('students.data.0.id', $student->id)
        );
});

it('generates missing qr codes for approved students', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000102',
        'qr_code_value' => null,
        'qr_code_svg' => null,
    ]);

    $this->actingAs($admin)
        ->post("/admin/qr-codes/{$student->id}/generate")
        ->assertRedirect(route('admin.qr-codes.index'));

    $student->refresh();

    expect($student->qr_code_value)->toStartWith('SASN-STUDENT|')
        ->and($student->qr_code_svg)->toContain('<svg');
});

it('resets existing qr codes with a new scanner payload', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000103',
        'qr_code_value' => 'SASN-STUDENT|old|2026000103|student@example.test|old-token',
        'qr_code_svg' => '<svg></svg>',
    ]);

    $this->actingAs($admin)
        ->post("/admin/qr-codes/{$student->id}/reset")
        ->assertRedirect(route('admin.qr-codes.index'));

    $student->refresh();

    expect($student->qr_code_value)->not->toBe('SASN-STUDENT|old|2026000103|student@example.test|old-token')
        ->and($student->qr_code_value)->toStartWith('SASN-STUDENT|')
        ->and($student->qr_code_svg)->toContain('<svg');
});
