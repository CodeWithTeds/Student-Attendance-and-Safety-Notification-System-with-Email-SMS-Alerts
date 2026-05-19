<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentAttendanceLogResource;
use App\Services\Student\StudentAttendanceRecordService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceRecordController extends Controller
{
    public function __construct(
        protected StudentAttendanceRecordService $attendanceRecordService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('student/attendance-records', [
            'attendanceRecords' => StudentAttendanceLogResource::collection(
                $this->attendanceRecordService->getPaginatedRecords($request->user())
            ),
        ]);
    }
}
