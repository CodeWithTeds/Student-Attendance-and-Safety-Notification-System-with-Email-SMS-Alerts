import DataTablePagination from '@/components/common/DataTablePagination';
import AttendanceMonitoringToolbar from '@/features/parent-portal/components/AttendanceMonitoringToolbar';
import ParentAttendanceTable from '@/features/parent-portal/components/ParentAttendanceTable';
import ParentSummaryStrip from '@/features/parent-portal/components/ParentSummaryStrip';
import type {
    ChildAttendanceSummary,
    DailyTrendPoint,
    GuardianAttendanceRecord,
    GuardianChild,
    GuardianDashboardSummary,
    GuardianFilters,
    GuardianProfile,
    PaginatedRecords,
} from '@/features/parent-portal/types';
import { Head, router } from '@inertiajs/react';
import { CalendarCheck, Clock3, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';

interface Props {
    guardian: GuardianProfile;
    children: { data: GuardianChild[] };
    attendanceRecords: PaginatedRecords<GuardianAttendanceRecord>;
    filters: GuardianFilters;
    summary: GuardianDashboardSummary;
    childSummaries: ChildAttendanceSummary[];
    dailyTrend: DailyTrendPoint[];
}

const cleanMonitoringFilters = (filters: GuardianFilters) => {
    const allowed = {
        period: filters.period,
        date: filters.date,
        month: filters.month,
        student_id: filters.student_id,
        event_type: filters.event_type,
        search: filters.search,
    };

    return Object.fromEntries(Object.entries(allowed).filter(([, value]) => value !== '' && value !== null && value !== undefined));
};

function CompactTrend({ data }: { data: DailyTrendPoint[] }) {
    const maxValue = Math.max(...data.map((item) => item.total), 1);

    return (
        <div className="flex h-32 items-end gap-2 overflow-x-auto border-b border-[var(--border)] pb-2">
            {data.map((item) => (
                <div key={item.date} className="flex min-w-10 flex-1 flex-col items-center gap-1">
                    <div className="flex h-24 w-full items-end justify-center gap-1">
                        <div className="w-3 rounded-t bg-emerald-500" style={{ height: `${Math.max((item.check_ins / maxValue) * 100, item.check_ins ? 6 : 1)}%` }} title={`${item.label}: ${item.check_ins} time in`} />
                        <div className="w-3 rounded-t bg-orange-500" style={{ height: `${Math.max((item.check_outs / maxValue) * 100, item.check_outs ? 6 : 1)}%` }} title={`${item.label}: ${item.check_outs} time out`} />
                        <div className="w-3 rounded-t bg-rose-500" style={{ height: `${Math.max((item.late / maxValue) * 100, item.late ? 6 : 1)}%` }} title={`${item.label}: ${item.late} late`} />
                    </div>
                    <span className="text-[10px] font-medium text-[var(--muted-foreground)]">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

export default function AttendanceMonitoring({ children, attendanceRecords, filters, summary, childSummaries, dailyTrend }: Props) {
    const [localFilters, setLocalFilters] = useState<GuardianFilters>(filters);
    const records = attendanceRecords?.data ?? [];
    const meta = attendanceRecords?.meta ?? { current_page: 1, last_page: 1, per_page: 15, total: 0, from: 0, to: 0, links: [] };

    const updateFilter = (key: keyof GuardianFilters, value: string) => {
        setLocalFilters((current) => ({ ...current, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/parent/attendance-monitoring', cleanMonitoringFilters(localFilters), { preserveState: true, preserveScroll: true, replace: true });
    };

    const resetFilters = () => {
        setLocalFilters({});
        router.get('/parent/attendance-monitoring', {}, { preserveState: false, replace: true });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;

        const params = new URLSearchParams(url.split('?')[1] ?? '');
        router.get('/parent/attendance-monitoring', { ...cleanMonitoringFilters(localFilters), page: params.get('page') ?? '1' }, { preserveState: true });
    };

    const exportRows = () => {
        if (records.length === 0) return;

        const csv = [
            ['Student', 'Student Number', 'Event', 'Status', 'Scanned At', 'Schedule', 'Section'].join(','),
            ...records.map((record) => {
                const section = record.student.current_section;
                const schedule = record.schedule ?? section?.schedule ?? null;

                return [
                    `"${record.student.name}"`,
                    `"${record.student.student_number ?? ''}"`,
                    `"${record.event_label}"`,
                    `"${record.schedule_status ?? record.status_label}"`,
                    `"${record.scanned_at_full_display}"`,
                    `"${schedule ? `${schedule.time_in_display} - ${schedule.time_out_display}` : 'No schedule'}"`,
                    `"${section ? `${section.grade_level?.name ?? ''} ${section.name}`.trim() : 'Not assigned'}"`,
                ].join(',');
            }),
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `attendance_monitoring_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Attendance Monitoring" />

            <AttendanceMonitoringToolbar
                filters={localFilters}
                childrenOptions={children?.data ?? []}
                onFilterChange={updateFilter}
                onApply={applyFilters}
                onReset={resetFilters}
                onExport={exportRows}
            />

            <ParentSummaryStrip
                items={[
                    { label: 'Records', value: summary.total_logs, icon: CalendarCheck, tone: 'blue' },
                    { label: 'Time In', value: summary.check_ins, icon: LogIn, tone: 'green' },
                    { label: 'Time Out', value: summary.check_outs, icon: LogOut, tone: 'orange' },
                    { label: 'Late', value: summary.late, icon: Clock3, tone: 'red' },
                ]}
            />

            <div className="grid gap-4 border-b border-[var(--border)] p-4 xl:grid-cols-[minmax(0,1fr)_480px]">
                <div className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            {localFilters.period === 'monthly' ? 'Monthly attendance trend' : 'Daily attendance trend'}
                        </p>
                        <span className="text-xs text-[var(--muted-foreground)]">
                            {filters.date_from} to {filters.date_to}
                        </span>
                    </div>
                    <CompactTrend data={dailyTrend} />
                </div>

                <div className="min-w-0 overflow-auto">
                    <p className="mb-2 text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Per child totals</p>
                    <table className="w-full min-w-[440px] border-collapse text-[12px]">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="px-2 py-2 text-left font-semibold text-[var(--muted-foreground)]">Child</th>
                                <th className="px-2 py-2 text-left font-semibold text-[var(--muted-foreground)]">Last Scan</th>
                                <th className="px-2 py-2 text-right font-semibold text-[var(--muted-foreground)]">In</th>
                                <th className="px-2 py-2 text-right font-semibold text-[var(--muted-foreground)]">Out</th>
                                <th className="px-2 py-2 text-right font-semibold text-[var(--muted-foreground)]">Late</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {childSummaries.map((child) => (
                                <tr key={child.id} className="hover:bg-[var(--accent)]/30">
                                    <td className="px-2 py-2">
                                        <p className="font-medium text-[var(--foreground)]">{child.name}</p>
                                        <p className="text-[11px] text-[var(--muted-foreground)]">{child.student_number ?? child.section}</p>
                                    </td>
                                    <td className="px-2 py-2 text-[var(--muted-foreground)]">{child.last_seen}</td>
                                    <td className="px-2 py-2 text-right font-semibold text-emerald-700">{child.check_ins}</td>
                                    <td className="px-2 py-2 text-right font-semibold text-orange-700">{child.check_outs}</td>
                                    <td className="px-2 py-2 text-right font-semibold text-rose-700">{child.late}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ParentAttendanceTable records={records} meta={meta} />
            <DataTablePagination meta={meta} onPageChange={handlePageChange} />
        </div>
    );
}

AttendanceMonitoring.layout = {
    breadcrumbs: [
        { title: 'Parent Dashboard', href: '/parent/dashboard' },
        { title: 'Attendance Monitoring', href: '/parent/attendance-monitoring' },
    ],
};
