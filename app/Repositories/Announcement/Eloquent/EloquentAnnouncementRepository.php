<?php

namespace App\Repositories\Announcement\Eloquent;

use App\Enums\AnnouncementDeliveryStatus;
use App\Models\Announcement;
use App\Models\AnnouncementRecipient;
use App\Repositories\Announcement\Contracts\AnnouncementRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EloquentAnnouncementRepository implements AnnouncementRepositoryInterface
{
    public function chunkRecipientIds(int $announcementId, int $chunkSize, callable $callback): void
    {
        AnnouncementRecipient::query()
            ->where('announcement_id', $announcementId)
            ->orderBy('id')
            ->select('id')
            ->chunkById($chunkSize, function ($recipients) use ($callback): void {
                $callback($recipients->pluck('id')->all());
            });
    }

    public function findForDeliveryChunk(int $announcementId, array $recipientIds): Announcement
    {
        return Announcement::query()
            ->with([
                'recipients' => fn ($query) => $query->whereIn('id', $recipientIds),
                'recipients.guardian',
            ])
            ->findOrFail($announcementId);
    }

    public function getDeliveryStatusCounts(int $announcementId): array
    {
        $total = AnnouncementRecipient::query()
            ->where('announcement_id', $announcementId)
            ->count();

        $failed = AnnouncementRecipient::query()
            ->where('announcement_id', $announcementId)
            ->where(function ($query): void {
                $query
                    ->where('email_status', AnnouncementDeliveryStatus::FAILED->value)
                    ->orWhere('sms_status', AnnouncementDeliveryStatus::FAILED->value);
            })
            ->count();

        return [
            'total' => $total,
            'failed' => $failed,
        ];
    }

    public function getPaginated(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Announcement::query()
            ->with('creator:id,name,email')
            ->withCount('recipients')
            ->withCount([
                'recipients as sms_sent_count' => fn ($query) => $query->where('sms_status', AnnouncementDeliveryStatus::SENT->value),
                'recipients as email_sent_count' => fn ($query) => $query->where('email_status', AnnouncementDeliveryStatus::SENT->value),
            ])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($searchQuery) use ($search): void {
                    $searchQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%");
                });
            })
            ->latest('sent_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function createWithRecipients(array $announcementData, Collection $guardians): Announcement
    {
        return DB::transaction(function () use ($announcementData, $guardians): Announcement {
            $announcement = Announcement::create($announcementData);

            $announcement->recipients()->createMany(
                $guardians->map(fn ($guardian) => ['guardian_id' => $guardian->id])->all()
            );

            return $announcement->load('recipients.guardian', 'creator');
        });
    }

    public function updateRecipientDelivery(Announcement $announcement, int $guardianId, array $data): bool
    {
        return (bool) $announcement->recipients()
            ->where('guardian_id', $guardianId)
            ->update($data);
    }

    public function updateStatus(Announcement $announcement, array $data): bool
    {
        return $announcement->update($data);
    }

    public function updateStatusById(int $announcementId, array $data): bool
    {
        return (bool) Announcement::query()
            ->whereKey($announcementId)
            ->update($data);
    }
}
