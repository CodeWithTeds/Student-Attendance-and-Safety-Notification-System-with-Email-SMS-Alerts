<?php

namespace App\Repositories\Dashboard;

use App\Repositories\BaseRepositoryInterface;
use App\Models\User;
use App\Models\Section;
use App\Models\StudentAttendanceLog;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function getAnalyticsStats(): array
    {
        return [
            'total_students' => DB::table('users')->where('role', 'student')->count(),
            'total_parents' => DB::table('users')->where('role', 'guardian')->count(),
            'total_advisers' => DB::table('users')->where('role', 'adviser')->count(),
            'total_sections' => DB::table('sections')->count(),
            'total_attendance_today' => DB::table('student_attendance_logs')
                ->whereDate('created_at', today())
                ->count(),
        ];
    }
}
