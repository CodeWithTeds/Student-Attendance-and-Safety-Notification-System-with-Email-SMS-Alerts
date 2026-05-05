<?php

namespace App\Providers;

use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use App\Repositories\Attendance\Eloquent\EloquentStudentAttendanceRepository;
use App\Repositories\TaskRepository;
use App\Repositories\TaskRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->singleton(StudentAttendanceRepositoryInterface::class, EloquentStudentAttendanceRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {}
}
