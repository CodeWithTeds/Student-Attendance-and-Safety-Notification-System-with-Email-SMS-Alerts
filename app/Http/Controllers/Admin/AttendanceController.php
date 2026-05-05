<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;
use App\Http\Resources\StudentAttendanceLogResource;
use App\Services\Attendance\AttendanceManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(
        protected AttendanceManagementService $attendanceManagementService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/attendance/index', [
            'attendanceRecords' => StudentAttendanceLogResource::collection(
                $this->attendanceManagementService->getPaginatedRecords($request->only(['search', 'event_type', 'date']))
            ),
            'filters' => $request->only(['search', 'event_type', 'date']),
        ]);
    }

    public function update(UpdateAttendanceRequest $request, int $attendance): RedirectResponse
    {
        $this->attendanceManagementService->updateAttendance($attendance, $request->attendanceData());

        return redirect()->route('admin.attendance.index')->with('success', 'Attendance record updated successfully.');
    }
}
