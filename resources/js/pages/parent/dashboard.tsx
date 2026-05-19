import DataTablePagination from '@/components/common/DataTablePagination';
import ParentAttendanceTable from '@/features/parent-portal/components/ParentAttendanceTable';
import ParentPortalToolbar from '@/features/parent-portal/components/ParentPortalToolbar';
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
import { CalendarCheck, CheckCircle, Clock3, LogIn, LogOut, UsersRound } from 'lucide-react';
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

const cleanFilters = (filters: GuardianFilters) =>
    Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined));

function TrendBars({ data }: { data: DailyTrendPoint[] }) {
    const maxValue = Math.max(...data.map((item) => item.total), 1);

    return (
        <div className="flex h-36 items-end gap-2 overflow-x-auto border-b border-[var(--border)] pb-2">
            {data.map((item) => (
                <div key={item.date} className="flex min-w-11 flex-1 flex-col items-center gap-1.5">
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

export default function ParentDashboard({ children, attendanceRecords, filters, summary, childSummaries, dailyTrend }: Props) {
    const [localFilters, setLocalFilters] = useState<GuardianFilters>(filters);
    const records = attendanceRecords?.data ?? [];
    const meta = attendanceRecords?.meta ?? { current_page: 1, last_page: 1, per_page: 15, total: 0, from: 0, to: 0, links: [] };

    const updateFilter = (key: keyof GuardianFilters, value: string) => {
        setLocalFilters((current) => ({ ...current, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/parent/dashboard', cleanFilters(localFilters), { preserveState: true, preserveScroll: true, replace: true });
    };

    const resetFilters = () => {
        setLocalFilters({});
        router.get('/parent/dashboard', {}, { preserveState: false, replace: true });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;

        const params = new URLSearchParams(url.split('?')[1] ?? '');
        router.get('/parent/dashboard', { ...cleanFilters(localFilters), page: params.get('page') ?? '1' }, { preserveState: true });
    };

    const handleExport = () => {
        if (records.length === 0) return;

        const headers = ['Student', 'Student Number', 'Event', 'Status', 'Scanned At', 'Schedule', 'Section'];
        const csv = [
            headers.join(','),
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
        link.download = `child_attendance_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Parent Dashboard" />

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
                    { label: 'Linked Children', value: summary.children, icon: UsersRound, tone: 'default' },
                    { label: 'Time In', value: summary.check_ins, icon: LogIn, tone: 'green' },
                    { label: 'Time Out', value: summary.check_outs, icon: LogOut, tone: 'orange' },
                    { label: 'Late', value: summary.late, icon: Clock3, tone: 'red' },
                ]}
            />

            <div className="grid gap-4 border-b border-[var(--border)] p-4 xl:grid-cols-[minmax(0,1fr)_520px]">
                <div className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Attendance trend</p>
                        <div className="flex flex-wrap gap-3 text-[11px] font-medium text-[var(--muted-foreground)]">
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Time In</span>
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-orange-500" /> Time Out</span>
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-rose-500" /> Late</span>
                        </div>
                    </div>
                    <TrendBars data={dailyTrend} />
                </div>

                <div className="min-w-0 overflow-auto">
                    <p className="mb-2 text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Child summary</p>
                    <table className="w-full min-w-[500px] border-collapse text-[12px]">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="px-2 py-2 text-left font-semibold text-[var(--muted-foreground)]">Child</th>
                                <th className="px-2 py-2 text-left font-semibold text-[var(--muted-foreground)]">Schedule</th>
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
                                    <td className="px-2 py-2 text-[var(--muted-foreground)]">{child.schedule}</td>
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

ParentDashboard.layout = {
    breadcrumbs: [
        { title: 'Parent Dashboard', href: '/parent/dashboard' },
        { title: 'Child Attendance', href: '/parent/dashboard' },
    ],
};
