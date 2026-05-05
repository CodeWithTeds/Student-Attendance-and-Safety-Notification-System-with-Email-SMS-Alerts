<?php

namespace App\Http\Controllers;

use App\Http\Requests\Attendance\StoreQrAttendanceRequest;
use App\Http\Resources\StudentAttendanceLogResource;
use App\Services\Attendance\StudentAttendanceService;
use Illuminate\Http\JsonResponse;

class PublicQrAttendanceController extends Controller
{
    public function __construct(
        protected StudentAttendanceService $studentAttendanceService
    ) {}

    public function store(StoreQrAttendanceRequest $request): JsonResponse
    {
        return (new StudentAttendanceLogResource($this->studentAttendanceService->recordScan($request->attendanceData())))
            ->response()
            ->setStatusCode(201);
    }
}
