<?php

namespace App\Services\Audit;

use App\Enums\AuditLogCategory;
use App\Models\AuditLog;
use App\Repositories\Audit\Contracts\AuditTrailRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuditTrailService
{
    public function __construct(
        protected AuditTrailRepositoryInterface $auditTrailRepository
    ) {}

    public function getAuditLogs(array $filters = []): LengthAwarePaginator
    {
        return $this->auditTrailRepository->getPaginatedAuditLogs($filters);
    }

    public function getAttendanceChanges(array $filters = []): LengthAwarePaginator
    {
        return $this->auditTrailRepository->getPaginatedAttendanceChanges($filters);
    }

    public function getNotificationHistory(array $filters = []): LengthAwarePaginator
    {
        return $this->auditTrailRepository->getPaginatedNotificationHistory($filters);
    }

    public function getSummary(): array
    {
        return $this->auditTrailRepository->getSummary();
    }

    public function record(
        AuditLogCategory $category,
        string $action,
        string $description,
        ?Model $auditable = null,
        array $metadata = [],
        ?int $actorId = null
    ): AuditLog {
        return $this->auditTrailRepository->create([
            'actor_id' => $actorId ?? Auth::id(),
            'category' => $category->value,
            'action' => $action,
            'auditable_type' => $auditable ? $auditable::class : null,
            'auditable_id' => $auditable?->getKey(),
            'description' => $description,
            'metadata' => $this->sanitizeMetadata($metadata),
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
        ]);
    }

    protected function sanitizeMetadata(array $metadata): array
    {
        return collect($metadata)
            ->reject(fn ($value, string $key): bool => Str::contains($key, ['password', 'token', 'secret']))
            ->all();
    }
}
