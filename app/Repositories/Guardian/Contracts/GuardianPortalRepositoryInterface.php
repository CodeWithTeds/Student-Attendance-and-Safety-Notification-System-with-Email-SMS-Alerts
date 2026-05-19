<?php

namespace App\Repositories\Guardian\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface GuardianPortalRepositoryInterface
{
    public function getGuardianWithChildren(int $guardianId): ?User;

    public function getChildAttendanceLogs(User $guardian, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getChildAttendanceCollection(User $guardian, array $filters = []): Collection;

    public function getAnnouncementNotifications(User $guardian, array $filters = [], int $perPage = 10): LengthAwarePaginator;
}
