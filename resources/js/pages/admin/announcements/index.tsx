import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DataTablePagination from '@/components/common/DataTablePagination';
import AnnouncementModal from '@/features/announcements/components/AnnouncementModal';
import AnnouncementTable from '@/features/announcements/components/AnnouncementTable';
import AnnouncementToolbar from '@/features/announcements/components/AnnouncementToolbar';
import type {
    Announcement,
    AnnouncementFilters,
    AnnouncementMeta,
    GuardianOption,
} from '@/features/announcements/types';

interface ResourceCollection<T> {
    data: T[];
}

interface Props {
    announcements: {
        data: Announcement[];
        meta: AnnouncementMeta;
    };
    guardians: ResourceCollection<GuardianOption>;
    filters: AnnouncementFilters;
}

function cleanFilters(filters: AnnouncementFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).filter(
            ([, value]) => value !== '' && value !== undefined,
        ),
    ) as Record<string, string>;
}

export default function AnnouncementsIndex({
    announcements,
    guardians,
    filters,
}: Props) {
    const [activeFilters, setActiveFilters] = useState<AnnouncementFilters>(
        filters ?? {},
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const data = announcements?.data ?? [];
    const guardianOptions = guardians?.data ?? [];
    const meta = announcements?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    };

    const applyFilters = (nextFilters: AnnouncementFilters) => {
        setActiveFilters(nextFilters);
        router.get('/admin/announcements', cleanFilters(nextFilters), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) {
            return;
        }

        const page =
            new URL(url, window.location.origin).searchParams.get('page') ??
            '1';

        router.get(
            '/admin/announcements',
            { ...cleanFilters(activeFilters), page },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Announcement Management" />

            <AnnouncementToolbar
                search={activeFilters.search ?? ''}
                onSearchChange={(search) => applyFilters({ search })}
                onCreate={() => setIsModalOpen(true)}
            />

            <AnnouncementTable announcements={data} meta={meta} />

            <DataTablePagination meta={meta} onPageChange={handlePageChange} />

            <AnnouncementModal
                isOpen={isModalOpen}
                guardians={guardianOptions}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

AnnouncementsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Announcement Management', href: '/admin/announcements' },
    ],
};
