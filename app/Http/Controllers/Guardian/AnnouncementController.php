<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guardian\AnnouncementIndexRequest;
use App\Http\Resources\NotificationHistoryResource;
use App\Http\Resources\UserResource;
use App\Services\Guardian\GuardianAnnouncementService;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function __construct(protected GuardianAnnouncementService $announcementService) {}

    public function index(AnnouncementIndexRequest $request): Response
    {
        $data = $this->announcementService->getAnnouncementData($request->user(), $request->filters());

        return Inertia::render('parent/announcements', [
            'guardian' => (new UserResource($data['guardian']))->resolve($request),
            'announcementNotifications' => NotificationHistoryResource::collection($data['announcementNotifications']),
            'filters' => $data['filters'],
            'summary' => $data['summary'],
        ]);
    }
}
