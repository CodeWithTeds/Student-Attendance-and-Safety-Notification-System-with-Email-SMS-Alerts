<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guardian\NotificationIndexRequest;
use App\Http\Resources\NotificationHistoryResource;
use App\Http\Resources\StudentAttendanceLogResource;
use App\Http\Resources\UserResource;
use App\Services\Guardian\GuardianNotificationService;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(protected GuardianNotificationService $notificationService) {}

    public function index(NotificationIndexRequest $request): Response
    {
        $data = $this->notificationService->getNotificationData($request->user(), $request->filters());

        return Inertia::render('parent/notifications', [
            'guardian' => (new UserResource($data['guardian']))->resolve($request),
            'children' => UserResource::collection($data['children']),
            'attendanceAlerts' => StudentAttendanceLogResource::collection($data['attendanceAlerts']),
            'announcementNotifications' => NotificationHistoryResource::collection($data['announcementNotifications']),
            'filters' => $data['filters'],
            'summary' => $data['summary'],
        ]);
    }
}
