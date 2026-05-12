<?php

namespace App\Repositories\System\Contracts;

use App\Models\SystemSetting;

interface SystemSettingRepositoryInterface
{
    public function firstOrCreate(array $defaults): SystemSetting;

    public function update(SystemSetting $systemSetting, array $data): bool;
}
