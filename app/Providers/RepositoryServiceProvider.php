<?php

namespace App\Providers;

use App\Repositories\Announcement\Contracts\AnnouncementRepositoryInterface;
use App\Repositories\Announcement\Eloquent\EloquentAnnouncementRepository;
use App\Repositories\Audit\Contracts\AuditTrailRepositoryInterface;
use App\Repositories\Audit\Eloquent\EloquentAuditTrailRepository;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use App\Repositories\Attendance\Eloquent\EloquentStudentAttendanceRepository;
use App\Repositories\Notification\Contracts\NotificationSettingRepositoryInterface;
use App\Repositories\Notification\Eloquent\EloquentNotificationSettingRepository;
use App\Repositories\System\Contracts\SystemSettingRepositoryInterface;
use App\Repositories\System\Eloquent\EloquentSystemSettingRepository;
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
        $this->app->singleton(NotificationSettingRepositoryInterface::class, EloquentNotificationSettingRepository::class);
        $this->app->singleton(AnnouncementRepositoryInterface::class, EloquentAnnouncementRepository::class);
        $this->app->singleton(AuditTrailRepositoryInterface::class, EloquentAuditTrailRepository::class);
        $this->app->singleton(SystemSettingRepositoryInterface::class, EloquentSystemSettingRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {}
}
