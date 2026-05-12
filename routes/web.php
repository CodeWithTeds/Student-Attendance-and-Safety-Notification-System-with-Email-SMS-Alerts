<?php

use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\AttendanceReportController;
use App\Http\Controllers\Admin\AuditTrailController;
use App\Http\Controllers\Admin\ClassSectionController;
use App\Http\Controllers\Admin\NotificationSettingController;
use App\Http\Controllers\Admin\ParentGuardianController;
use App\Http\Controllers\Admin\QrCodeController;
use App\Http\Controllers\Admin\SectionScheduleController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('qr-scanner', 'public/qr-scanner')->name('qr-scanner');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::post('students/bulk-assign-section', [StudentController::class, 'bulkAssignSection'])->name('students.bulk-assign');
        Route::put('students/{user}', [StudentController::class, 'update'])->name('students.update');
        Route::post('students/{id}/approve', [StudentController::class, 'approve'])->name('students.approve');

        Route::get('parents', [ParentGuardianController::class, 'index'])->name('parents.index');
        Route::post('parents', [ParentGuardianController::class, 'store'])->name('parents.store');
        Route::put('parents/{guardian}', [ParentGuardianController::class, 'update'])->name('parents.update');
        Route::delete('parents/{guardian}', [ParentGuardianController::class, 'destroy'])->name('parents.destroy');
        Route::post('parents/{guardian}/notify', [ParentGuardianController::class, 'notify'])->name('parents.notify');

        Route::get('notifications', [NotificationSettingController::class, 'index'])->name('notifications.index');
        Route::put('notifications/{notificationSetting}', [NotificationSettingController::class, 'update'])->name('notifications.update');
        Route::get('announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
        Route::post('announcements', [AnnouncementController::class, 'store'])->name('announcements.store');

        Route::get('class-sections', [ClassSectionController::class, 'index'])->name('class-sections.index');
        Route::get('schedules', [SectionScheduleController::class, 'index'])->name('schedules.index');
        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::put('attendance/{attendance}', [AttendanceController::class, 'update'])->name('attendance.update');
        Route::get('reports', [AttendanceReportController::class, 'index'])->name('reports.index');
        Route::get('audit-trail', [AuditTrailController::class, 'index'])->name('audit-trail.index');
        Route::get('qr-codes', [QrCodeController::class, 'index'])->name('qr-codes.index');
        Route::post('qr-codes/{student}/generate', [QrCodeController::class, 'generate'])->name('qr-codes.generate');
        Route::post('qr-codes/{student}/reset', [QrCodeController::class, 'reset'])->name('qr-codes.reset');
        Route::post('grade-levels', [ClassSectionController::class, 'storeGradeLevel'])->name('grade-levels.store');
        Route::put('grade-levels/{gradeLevel}', [ClassSectionController::class, 'updateGradeLevel'])->name('grade-levels.update');
        Route::delete('grade-levels/{gradeLevel}', [ClassSectionController::class, 'destroyGradeLevel'])->name('grade-levels.destroy');
        Route::post('advisers', [ClassSectionController::class, 'storeAdviser'])->name('advisers.store');
        Route::put('advisers/{adviser}', [ClassSectionController::class, 'updateAdviser'])->name('advisers.update');
        Route::delete('advisers/{adviser}', [ClassSectionController::class, 'destroyAdviser'])->name('advisers.destroy');
        Route::post('sections', [ClassSectionController::class, 'storeSection'])->name('sections.store');
        Route::put('sections/{section}', [ClassSectionController::class, 'updateSection'])->name('sections.update');
        Route::delete('sections/{section}', [ClassSectionController::class, 'destroySection'])->name('sections.destroy');
        Route::put('sections/{section}/schedule', [ClassSectionController::class, 'updateSectionSchedule'])->name('sections.schedule.update');
        Route::delete('sections/{section}/schedule', [ClassSectionController::class, 'destroySectionSchedule'])->name('sections.schedule.destroy');
        Route::post('sections/{section}/students', [ClassSectionController::class, 'assignStudents'])->name('sections.students.store');
        Route::delete('sections/{section}/students/{student}', [ClassSectionController::class, 'unassignStudent'])->name('sections.students.destroy');
    });
});

require __DIR__.'/settings.php';
