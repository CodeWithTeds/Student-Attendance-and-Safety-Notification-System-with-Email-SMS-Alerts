import { Head, router } from '@inertiajs/react';
import {
    Activity,
    Bell,
    CalendarDays,
    ClipboardList,
    History,
    RotateCcw,
    Search,
    ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import DataTablePagination from '@/components/common/DataTablePagination';
import type {
    AttendanceChangeAudit,
    AuditCategoryOption,
    AuditFilters,
    AuditLog,
    AuditSummary,
    NotificationHistory,
    ResourceCollection,
} from '@/features/audit-trail/types';
import { cn } from '@/lib/utils';

type ActiveTab = 'admin' | 'attendance' | 'notifications';

interface Props {
    auditLogs: ResourceCollection<AuditLog>;
    attendanceChanges: ResourceCollection<AttendanceChangeAudit>;
    notificationHistory: ResourceCollection<NotificationHistory>;
    summary: AuditSummary;
    categories: AuditCategoryOption[];
    filters: AuditFilters;
}

const tabs: { value: ActiveTab; label: string; icon: LucideIcon }[] = [
    { value: 'admin', label: 'Admin actions', icon: ShieldCheck },
    { value: 'attendance', label: 'Attendance changes', icon: Activity },
    { value: 'notifications', label: 'Notification history', icon: Bell },
];

function cleanFilters(filters: AuditFilters): AuditFilters {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined),
    ) as AuditFilters;
}

function statusClass(status: string | null): string {
    if (status === 'sent') {
        return 'bg-emerald-100 text-emerald-700';
    }

    if (status === 'failed') {
        return 'bg-red-100 text-red-700';
    }

    if (status === 'skipped') {
        return 'bg-amber-100 text-amber-700';
    }

    return 'bg-slate-100 text-slate-600';
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

export default function AuditTrailIndex({
    auditLogs,
    attendanceChanges,
    notificationHistory,
    summary,
    categories,
    filters,
}: Props) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('admin');
    const [activeFilters, setActiveFilters] = useState<AuditFilters>(filters ?? {});

    const applyFilters = (nextFilters: AuditFilters) => {
        setActiveFilters(nextFilters);
        router.get('/admin/audit-trail', cleanFilters(nextFilters), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handlePageChange = (pageName: string, url: string | null) => {
        if (!url) {
            return;
        }

        const page = new URL(url, window.location.origin).searchParams.get('page') ?? '1';

        router.get(
            '/admin/audit-trail',
            { ...cleanFilters(activeFilters), [pageName]: page },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Logs / Audit Trail" />

            <div className="border-b border-[var(--border)] p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-[var(--foreground)]">
                            Logs / Audit Trail
                        </h1>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            Review admin activity, attendance corrections, and notification delivery history.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <SummaryPill icon={History} label="Total logs" value={summary.total_admin_logs} />
                        <SummaryPill icon={ShieldCheck} label="Admin" value={summary.admin_actions} />
                        <SummaryPill icon={Activity} label="Attendance" value={summary.attendance_changes} />
                        <SummaryPill icon={Bell} label="Notifications" value={summary.notification_events} />
                    </div>
                </div>
            </div>

            <div className="border-b border-[var(--border)] p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;

                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => setActiveTab(tab.value)}
                                    className={cn(
                                        'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors',
                                        activeTab === tab.value
                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                                            : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)]',
                                    )}
                                >
                                    <Icon size={15} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                        <div className="relative">
                            <Search
                                size={15}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                            />
                            <input
                                value={activeFilters.search ?? ''}
                                onChange={(event) =>
                                    setActiveFilters((current) => ({
                                        ...current,
                                        search: event.target.value,
                                    }))
                                }
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        applyFilters(activeFilters);
                                    }
                                }}
                                placeholder="Search logs"
                                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 lg:w-64"
                            />
                        </div>

                        <select
                            value={activeFilters.category ?? ''}
                            onChange={(event) =>
                                setActiveFilters((current) => ({
                                    ...current,
                                    category: event.target.value as AuditFilters['category'],
                                }))
                            }
                            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                        >
                            <option value="">All categories</option>
                            {categories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>

                        <div className="relative">
                            <CalendarDays
                                size={15}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                            />
                            <input
                                type="date"
                                value={activeFilters.date ?? ''}
                                onChange={(event) =>
                                    setActiveFilters((current) => ({
                                        ...current,
                                        date: event.target.value,
                                    }))
                                }
                                className="h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => applyFilters(activeFilters)}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-[var(--primary-foreground)]"
                        >
                            <Search size={15} />
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={() => applyFilters({})}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--accent)]"
                        >
                            <RotateCcw size={15} />
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'admin' && (
                <AdminActivityTable logs={auditLogs.data} />
            )}
            {activeTab === 'attendance' && (
                <AttendanceChangesTable changes={attendanceChanges.data} />
            )}
            {activeTab === 'notifications' && (
                <NotificationHistoryTable history={notificationHistory.data} />
            )}

            {activeTab === 'admin' && (
                <DataTablePagination
                    meta={auditLogs.meta}
                    onPageChange={(url) => handlePageChange('audit_page', url)}
                />
            )}
            {activeTab === 'attendance' && (
                <DataTablePagination
                    meta={attendanceChanges.meta}
                    onPageChange={(url) => handlePageChange('attendance_page', url)}
                />
            )}
            {activeTab === 'notifications' && (
                <DataTablePagination
                    meta={notificationHistory.meta}
                    onPageChange={(url) => handlePageChange('notification_page', url)}
                />
            )}
        </div>
    );
}

function SummaryPill({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-lg border border-[var(--border)] px-3 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
                <Icon size={14} />
                {label}
            </div>
            <div className="mt-1 text-lg font-bold text-[var(--foreground)]">
                {value}
            </div>
        </div>
    );
}

function AdminActivityTable({ logs }: { logs: AuditLog[] }) {
    return (
        <div className="min-h-0 flex-1 overflow-auto bg-[var(--background)] px-4">
            <table className="w-full min-w-[1080px] border-collapse text-[13px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <HeaderCell>Action</HeaderCell>
                        <HeaderCell>Actor</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Metadata</HeaderCell>
                        <HeaderCell>IP</HeaderCell>
                        <HeaderCell>Recorded</HeaderCell>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {logs.length === 0 ? (
                        <EmptyRow colSpan={6} label="No admin activity logs found." />
                    ) : (
                        logs.map((log) => (
                            <tr key={log.id} className="hover:bg-[var(--accent)]/30">
                                <td className="px-3 py-3">
                                    <div className="font-semibold text-[var(--foreground)]">
                                        {log.action_label}
                                    </div>
                                    <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                        {log.category_label}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--foreground)]">
                                    <div>{log.actor?.name ?? 'System'}</div>
                                    <div className="text-xs text-[var(--muted-foreground)]">
                                        {log.actor?.email ?? '-'}
                                    </div>
                                </td>
                                <td className="max-w-[360px] px-3 py-3 text-sm text-[var(--foreground)]">
                                    {log.description}
                                </td>
                                <td className="max-w-[360px] px-3 py-3">
                                    <div className="space-y-1 text-xs text-[var(--muted-foreground)]">
                                        {Object.entries(log.metadata).slice(0, 4).map(([key, value]) => (
                                            <div key={key} className="truncate">
                                                <span className="font-semibold text-[var(--foreground)]">
                                                    {key}:
                                                </span>{' '}
                                                {formatValue(value)}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--muted-foreground)]">
                                    {log.ip_address ?? '-'}
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--muted-foreground)]">
                                    {log.created_at_display}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function AttendanceChangesTable({ changes }: { changes: AttendanceChangeAudit[] }) {
    return (
        <div className="min-h-0 flex-1 overflow-auto bg-[var(--background)] px-4">
            <table className="w-full min-w-[1040px] border-collapse text-[13px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <HeaderCell>Student</HeaderCell>
                        <HeaderCell>Changed by</HeaderCell>
                        <HeaderCell>Event</HeaderCell>
                        <HeaderCell>Scanned time</HeaderCell>
                        <HeaderCell>Note</HeaderCell>
                        <HeaderCell>Recorded</HeaderCell>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {changes.length === 0 ? (
                        <EmptyRow colSpan={6} label="No attendance changes found." />
                    ) : (
                        changes.map((change) => (
                            <tr key={change.id} className="hover:bg-[var(--accent)]/30">
                                <td className="px-3 py-3">
                                    <div className="font-semibold text-[var(--foreground)]">
                                        {change.student?.name ?? 'Unknown student'}
                                    </div>
                                    <div className="text-xs text-[var(--muted-foreground)]">
                                        {(change.student?.student_number as string | null | undefined) ?? '-'}
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--foreground)]">
                                    <div>{change.editor?.name ?? 'System'}</div>
                                    <div className="text-xs text-[var(--muted-foreground)]">
                                        {change.editor?.email ?? '-'}
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--foreground)]">
                                    {change.old_event_label} to {change.new_event_label}
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--foreground)]">
                                    <div>{change.old_scanned_at_display}</div>
                                    <div className="text-xs text-[var(--muted-foreground)]">
                                        to {change.new_scanned_at_display}
                                    </div>
                                </td>
                                <td className="max-w-[320px] px-3 py-3 text-sm text-[var(--muted-foreground)]">
                                    {change.note ?? '-'}
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--muted-foreground)]">
                                    {change.created_at_display}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function NotificationHistoryTable({ history }: { history: NotificationHistory[] }) {
    return (
        <div className="min-h-0 flex-1 overflow-auto bg-[var(--background)] px-4">
            <table className="w-full min-w-[1080px] border-collapse text-[13px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <HeaderCell>Announcement</HeaderCell>
                        <HeaderCell>Guardian</HeaderCell>
                        <HeaderCell>SMS</HeaderCell>
                        <HeaderCell>Email</HeaderCell>
                        <HeaderCell>Error</HeaderCell>
                        <HeaderCell>Updated</HeaderCell>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {history.length === 0 ? (
                        <EmptyRow colSpan={6} label="No notification history found." />
                    ) : (
                        history.map((item) => (
                            <tr key={item.id} className="hover:bg-[var(--accent)]/30">
                                <td className="max-w-[360px] px-3 py-3">
                                    <div className="font-semibold text-[var(--foreground)]">
                                        {item.announcement.title ?? 'Untitled announcement'}
                                    </div>
                                    <div className="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)]">
                                        {item.announcement.message ?? '-'}
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--foreground)]">
                                    <div>{item.guardian?.name ?? 'Unknown guardian'}</div>
                                    <div className="text-xs text-[var(--muted-foreground)]">
                                        {item.guardian?.email ?? '-'}
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-semibold', statusClass(item.sms_status))}>
                                        {item.sms_status ?? 'queued'}
                                    </span>
                                    <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                                        {item.sms_sent_at_display ?? '-'}
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-semibold', statusClass(item.email_status))}>
                                        {item.email_status ?? 'queued'}
                                    </span>
                                    <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                                        {item.email_sent_at_display ?? '-'}
                                    </div>
                                </td>
                                <td className="max-w-[280px] px-3 py-3 text-sm text-[var(--muted-foreground)]">
                                    {item.error_message ?? '-'}
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--muted-foreground)]">
                                    {item.updated_at_display}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function HeaderCell({ children }: { children: ReactNode }) {
    return (
        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
            {children}
        </th>
    );
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
    return (
        <tr>
            <td colSpan={colSpan}>
                <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                    <ClipboardList size={44} className="mb-4 opacity-20" />
                    <p className="text-sm font-medium">{label}</p>
                </div>
            </td>
        </tr>
    );
}

AuditTrailIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Logs / Audit Trail', href: '/admin/audit-trail' },
    ],
};
