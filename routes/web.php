<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ParentGuardianController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\UserController;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        
        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::post('students/{id}/approve', [StudentController::class, 'approve'])->name('students.approve');

        Route::get('parents', [ParentGuardianController::class, 'index'])->name('parents.index');
        Route::post('parents', [ParentGuardianController::class, 'store'])->name('parents.store');
        Route::put('parents/{guardian}', [ParentGuardianController::class, 'update'])->name('parents.update');
        Route::delete('parents/{guardian}', [ParentGuardianController::class, 'destroy'])->name('parents.destroy');
        Route::post('parents/{guardian}/notify', [ParentGuardianController::class, 'notify'])->name('parents.notify');
    });
});

require __DIR__ . '/settings.php';
