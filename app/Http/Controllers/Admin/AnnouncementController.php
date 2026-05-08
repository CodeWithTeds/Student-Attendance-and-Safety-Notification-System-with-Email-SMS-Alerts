<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Announcement\StoreAnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Http\Resources\UserResource;
use App\Services\Announcement\AnnouncementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function __construct(
        protected AnnouncementService $announcementService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/announcements/index', [
            'announcements' => AnnouncementResource::collection($this->announcementService->getPaginatedAnnouncements($request->only('search'))),
            'guardians' => UserResource::collection($this->announcementService->getGuardianOptions()),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        $this->announcementService->sendAnnouncement($request->announcementData(), $request->user()?->id);

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement queued for delivery.');
    }
}
