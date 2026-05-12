<?php

namespace App\Repositories\System\Eloquent;

use App\Models\SystemSetting;
use App\Repositories\System\Contracts\SystemSettingRepositoryInterface;

class EloquentSystemSettingRepository implements SystemSettingRepositoryInterface
{
    public function firstOrCreate(array $defaults): SystemSetting
    {
        return SystemSetting::query()->firstOrCreate([], $defaults);
    }

    public function update(SystemSetting $systemSetting, array $data): bool
    {
        return $systemSetting->update($data);
    }
}
