import DataTablePagination from '@/components/common/DataTablePagination';
import AnnouncementNotificationTable from '@/features/parent-portal/components/AnnouncementNotificationTable';
import AnnouncementToolbar from '@/features/parent-portal/components/AnnouncementToolbar';
import ParentSummaryStrip from '@/features/parent-portal/components/ParentSummaryStrip';
import type {
    GuardianAnnouncementSummary,
    GuardianFilters,
    GuardianProfile,
    NotificationHistory,
    PaginatedRecords,
} from '@/features/parent-portal/types';
import { Head, router } from '@inertiajs/react';
import { Mail, Megaphone, MessageSquareText, UsersRound } from 'lucide-react';
import { useState } from 'react';

interface Props {
    guardian: GuardianProfile;
    announcementNotifications: PaginatedRecords<NotificationHistory>;
    filters: GuardianFilters;
    summary: GuardianAnnouncementSummary;
}

const cleanFilters = (filters: GuardianFilters) =>
    Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined),
    );

export default function ParentAnnouncements({ announcementNotifications, filters, summary }: Props) {
    const [localFilters, setLocalFilters] = useState<GuardianFilters>(filters);
    const rows = announcementNotifications?.data ?? [];
    const meta = announcementNotifications?.meta ?? { current_page: 1, last_page: 1, per_page: 15, total: 0, from: 0, to: 0, links: [] };

    const updateFilter = (key: keyof GuardianFilters, value: string) => {
        setLocalFilters((current) => ({ ...current, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/parent/announcements', cleanFilters(localFilters), { preserveState: true, preserveScroll: true, replace: true });
    };

    const resetFilters = () => {
        setLocalFilters({});
        router.get('/parent/announcements', {}, { preserveState: false, replace: true });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;

        const params = new URLSearchParams(url.split('?')[1] ?? '');
        router.get('/parent/announcements', { ...cleanFilters(localFilters), notifications_page: params.get('page') ?? '1' }, { preserveState: true });
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="School Announcements" />

            <AnnouncementToolbar
                filters={localFilters}
                onFilterChange={updateFilter}
                onApply={applyFilters}
                onReset={resetFilters}
            />

            <ParentSummaryStrip
                items={[
                    { label: 'School Alerts', value: meta.total, icon: Megaphone, tone: 'blue' },
                    { label: 'Linked Children', value: summary.total_children, icon: UsersRound, tone: 'default' },
                    { label: 'SMS', value: summary.sms_enabled ? summary.sms_contact || 'Enabled' : 'Off', icon: MessageSquareText, tone: summary.sms_enabled ? 'green' : 'default' },
                    { label: 'Email', value: summary.email_enabled ? summary.email_contact : 'Off', icon: Mail, tone: summary.email_enabled ? 'blue' : 'default' },
                ]}
            />

            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2">
                    <div>
                        <p className="text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">School alert announcements</p>
                        <p className="text-xs text-[var(--muted-foreground)]">SMS and email delivery history for school announcements sent to this parent account.</p>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto">
                    <AnnouncementNotificationTable notifications={rows} meta={meta} scrollClassName="max-h-none" />
                </div>

                <DataTablePagination meta={meta} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}

ParentAnnouncements.layout = {
    breadcrumbs: [
        { title: 'Parent Dashboard', href: '/parent/dashboard' },
        { title: 'School Announcements', href: '/parent/announcements' },
    ],
};
