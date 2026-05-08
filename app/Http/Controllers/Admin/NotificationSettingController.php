<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notification\UpdateNotificationSettingRequest;
use App\Http\Resources\NotificationSettingResource;
use App\Services\Notification\NotificationSettingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotificationSettingController extends Controller
{
    public function __construct(
        protected NotificationSettingService $notificationSettingService
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/notifications/index', [
            'notificationSettings' => NotificationSettingResource::collection($this->notificationSettingService->getSettings()),
        ]);
    }

    public function update(UpdateNotificationSettingRequest $request, int $notificationSetting): RedirectResponse
    {
        $this->notificationSettingService->updateSetting($notificationSetting, $request->settingData());

        return redirect()->route('admin.notifications.index')->with('success', 'Notification setting updated successfully.');
    }
}
