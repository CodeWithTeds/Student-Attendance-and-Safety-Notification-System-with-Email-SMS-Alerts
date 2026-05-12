<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\UpdateSystemSettingRequest;
use App\Http\Resources\SystemSettingResource;
use App\Services\System\SystemSettingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    public function __construct(
        protected SystemSettingService $systemSettingService
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/system-settings/index', [
            'settings' => new SystemSettingResource($this->systemSettingService->getSettings()),
            'roles' => $this->systemSettingService->getRoleOptions(),
            'permissionGroups' => $this->systemSettingService->getPermissionGroups(),
        ]);
    }

    public function update(UpdateSystemSettingRequest $request): RedirectResponse
    {
        $this->systemSettingService->updateSettings($request->settingData());

        return redirect()->route('admin.system-settings.index')->with('success', 'System settings updated successfully.');
    }
}
