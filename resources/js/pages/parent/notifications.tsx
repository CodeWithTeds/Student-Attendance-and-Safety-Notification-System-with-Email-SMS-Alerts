import DataTablePagination from '@/components/common/DataTablePagination';
import AnnouncementNotificationTable from '@/features/parent-portal/components/AnnouncementNotificationTable';
import ParentAttendanceTable from '@/features/parent-portal/components/ParentAttendanceTable';
import ParentPortalToolbar from '@/features/parent-portal/components/ParentPortalToolbar';
import ParentSummaryStrip from '@/features/parent-portal/components/ParentSummaryStrip';
import type {
    GuardianAttendanceRecord,
    GuardianChild,
    GuardianFilters,
    GuardianNotificationSummary,
    GuardianProfile,
    NotificationHistory,
    PaginatedRecords,
} from '@/features/parent-portal/types';
import { Head, router } from '@inertiajs/react';
import { BellRing, Mail, MessageSquareText, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface Props {
    guardian: GuardianProfile;
    children: { data: GuardianChild[] };
    attendanceAlerts: PaginatedRecords<GuardianAttendanceRecord>;
    announcementNotifications: PaginatedRecords<NotificationHistory>;
    filters: GuardianFilters;
    summary: GuardianNotificationSummary;
}

const cleanFilters = (filters: GuardianFilters) =>
    Object.fromEntries(
        Object.entries({
            search: filters.search,
            student_id: filters.student_id,
            event_type: filters.event_type,
            date_from: filters.date_from,
            date_to: filters.date_to,
        }).filter(([, value]) => value !== '' && value !== null && value !== undefined),
    );

export default function ParentNotifications({ guardian, children, attendanceAlerts, announcementNotifications, filters, summary }: Props) {
    const [localFilters, setLocalFilters] = useState<GuardianFilters>(filters);
    const records = attendanceAlerts?.data ?? [];
    const meta = attendanceAlerts?.meta ?? { current_page: 1, last_page: 1, per_page: 15, total: 0, from: 0, to: 0, links: [] };
    const notificationRows = announcementNotifications?.data ?? [];
    const notificationMeta = announcementNotifications?.meta ?? { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0, links: [] };

    const updateFilter = (key: keyof GuardianFilters, value: string) => {
        setLocalFilters((current) => ({ ...current, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/parent/notifications', cleanFilters(localFilters), { preserveState: true, preserveScroll: true, replace: true });
    };

    const resetFilters = () => {
        setLocalFilters({});
        router.get('/parent/notifications', {}, { preserveState: false, replace: true });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;

        const params = new URLSearchParams(url.split('?')[1] ?? '');
        router.get('/parent/notifications', { ...cleanFilters(localFilters), page: params.get('page') ?? '1' }, { preserveState: true });
    };

    const handleExport = () => {
        if (records.length === 0) return;

        const headers = ['Student', 'Event', 'Status', 'Scanned At', 'SMS Enabled', 'Email Enabled'];
        const csv = [
            headers.join(','),
            ...records.map((record) =>
                [
                    `"${record.student.name}"`,
                    `"${record.event_label}"`,
                    `"${record.schedule_status ?? record.status_label}"`,
                    `"${record.scanned_at_full_display}"`,
                    guardian.notification_sms_enabled ? 'Yes' : 'No',
                    guardian.notification_email_enabled ? 'Yes' : 'No',
                ].join(','),
            ),
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `parent_notifications_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Parent Notifications" />

            <ParentPortalToolbar
                filters={localFilters}
                childrenOptions={children?.data ?? []}
                onFilterChange={updateFilter}
                onApply={applyFilters}
                onReset={resetFilters}
                onExport={handleExport}
            />

            <ParentSummaryStrip
                items={[
                    { label: 'Attendance Alerts', value: summary.total_alerts, icon: BellRing, tone: 'blue' },
                    { label: 'Late Alerts', value: summary.late_alerts, icon: ShieldCheck, tone: 'red' },
                    { label: 'SMS', value: summary.sms_enabled ? summary.sms_contact || 'Enabled' : 'Off', icon: MessageSquareText, tone: summary.sms_enabled ? 'green' : 'default' },
                    { label: 'Email', value: summary.email_enabled ? summary.email_contact : 'Off', icon: Mail, tone: summary.email_enabled ? 'blue' : 'default' },
                ]}
            />

            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2">
                    <div>
                        <p className="text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Attendance SMS / Email alert feed</p>
                        <p className="text-xs text-[var(--muted-foreground)]">Alerts use the same attendance validation as the QR scanner and follow your enabled channels.</p>
                    </div>
                </div>

                <ParentAttendanceTable records={records} meta={meta} guardian={guardian} showChannels />
                <DataTablePagination meta={meta} onPageChange={handlePageChange} />

                <AnnouncementNotificationTable notifications={notificationRows} meta={notificationMeta} />
            </div>
        </div>
    );
}

ParentNotifications.layout = {
    breadcrumbs: [
        { title: 'Parent Dashboard', href: '/parent/dashboard' },
        { title: 'Notifications', href: '/parent/notifications' },
    ],
};
