import { Head, router } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    CalendarDays,
    Download,
    LogIn,
    LogOut,
    RefreshCw,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { AttendanceBarChart } from '@/features/reports/components/AttendanceBarChart';
import type {
    AllReportsResult,
    DropdownSection,
    DropdownStudent,
    ReportFilters,
    ReportSummary,
} from '@/features/reports/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    sections: DropdownSection[];
    students: DropdownStudent[];
    filters: Partial<ReportFilters>;
    report: AllReportsResult | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultFilters(): ReportFilters {
    const today    = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
        report_type: 'daily',       // not really used for all-reports mode
        date_from:   firstDay.toISOString().slice(0, 10),
        date_to:     today.toISOString().slice(0, 10),
        student_id:  '',
        section_id:  '',
    };
}

function SummaryCard({
    label,
    value,
    icon: Icon,
    colorClass,
    bgClass,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bgClass} ${colorClass}`}>
                <Icon size={20} />
            </div>
            <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {label}
                </p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                    {value.toLocaleString()}
                </p>
            </div>
        </div>
    );
}

function ChartCard({
    title,
    description,
    data,
    maxLabelLength,
}: {
    title: string;
    description: string;
    data: { label: string; check_ins: number; check_outs: number; total: number }[];
    maxLabelLength?: number;
}) {
    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm">
            {/* Header */}
            <div className="mb-1">
                <h2 className="text-sm font-bold text-[var(--foreground)]">{title}</h2>
                <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
            </div>

            {/* Legend */}
            <div className="mb-3 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                    Check-in
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-orange-500" />
                    Check-out
                </span>
            </div>

            <AttendanceBarChart data={data} maxLabelLength={maxLabelLength} />

            {/* Row count */}
            <p className="mt-2 text-right text-xs text-[var(--muted-foreground)]">
                {data.length} {data.length === 1 ? 'entry' : 'entries'}
            </p>
        </div>
    );
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function buildCsv(report: AllReportsResult, filters: ReportFilters): string {
    const section = (title: string, rows: AllReportsResult['daily']): string => {
        const lines = [
            title,
            'Period / Label,Check-ins,Check-outs,Total',
            ...rows.map((r) => `"${r.label}",${r.check_ins},${r.check_outs},${r.total}`),
            '',
        ];

        return lines.join('\n');
    };

    const summaryLines = [
        'Overall Summary',
        `Total Records,${report.summary.total_records}`,
        `Total Check-ins,${report.summary.total_check_ins}`,
        `Total Check-outs,${report.summary.total_check_outs}`,
        `Unique Students,${report.summary.unique_students}`,
        `Date Range,${filters.date_from} to ${filters.date_to}`,
        '',
    ].join('\n');

    return [
        summaryLines,
        section('Daily Report', report.daily),
        section('Weekly Report', report.weekly),
        section('Monthly Report', report.monthly),
        section('Per-Student Report', report.per_student),
        section('Per-Section Report', report.per_section),
    ].join('\n');
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsIndex({ sections, students, filters, report }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const activeFilters: ReportFilters = {
        ...getDefaultFilters(),
        ...filters,
    };

    const updateFilter = (newFilters: Partial<ReportFilters>) => {
        setIsLoading(true);
        const nextFilters = {
            ...activeFilters,
            ...newFilters,
        };

        router.get('/admin/reports', nextFilters as any, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleClear = () => {
        router.get('/admin/reports', {}, { preserveScroll: true });
    };

    const handleExportCsv = () => {
        if (!report) return;

        const csv  = buildCsv(report, activeFilters);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href     = url;
        link.download = `attendance_full_report_${activeFilters.date_from}_${activeFilters.date_to}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Summary card config
    const summaryCards: {
        label: string;
        key: keyof ReportSummary;
        icon: React.ElementType;
        colorClass: string;
        bgClass: string;
    }[] = [
        { label: 'Total Records',    key: 'total_records',    icon: Activity, colorClass: 'text-[var(--primary)]', bgClass: 'bg-[var(--primary)]/10' },
        { label: 'Check-ins',        key: 'total_check_ins',  icon: LogIn,    colorClass: 'text-emerald-600',      bgClass: 'bg-emerald-50'           },
        { label: 'Check-outs',       key: 'total_check_outs', icon: LogOut,   colorClass: 'text-orange-600',       bgClass: 'bg-orange-50'            },
        { label: 'Unique Students',  key: 'unique_students',  icon: Users,    colorClass: 'text-violet-600',       bgClass: 'bg-violet-50'            },
    ];

    return (
        <div className="flex h-full flex-col overflow-auto">
            <Head title="Reports & Analytics" />

            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)] p-4 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-[var(--foreground)]">Reports &amp; Analytics</h1>
                            <p className="text-sm text-[var(--muted-foreground)]">
                                Live dashboard updates as you adjust filters.
                            </p>
                        </div>
                        {isLoading && <RefreshCw size={20} className="animate-spin text-[var(--primary)]" />}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {report && (
                            <button
                                id="export-csv-btn"
                                type="button"
                                onClick={handleExportCsv}
                                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                <Download size={15} />
                                Export All CSV
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleClear}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Filter controls */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Date From */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="date-from" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                            Date From
                        </label>
                        <div className="relative">
                            <CalendarDays size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]" />
                            <input
                                id="date-from"
                                type="date"
                                value={activeFilters.date_from}
                                onChange={(e) => updateFilter({ date_from: e.target.value })}
                                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition focus:border-[var(--primary)]"
                            />
                        </div>
                    </div>

                    {/* Date To */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="date-to" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                            Date To
                        </label>
                        <div className="relative">
                            <CalendarDays size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]" />
                            <input
                                id="date-to"
                                type="date"
                                value={activeFilters.date_to}
                                onChange={(e) => updateFilter({ date_to: e.target.value })}
                                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition focus:border-[var(--primary)]"
                            />
                        </div>
                    </div>

                    {/* Student filter */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="student-filter" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                            Student (optional)
                        </label>
                        <select
                            id="student-filter"
                            value={activeFilters.student_id ?? ''}
                            onChange={(e) => updateFilter({ student_id: e.target.value === '' ? '' : Number(e.target.value) })}
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                        >
                            <option value="">All Students</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}{s.student_number ? ` (${s.student_number})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Section filter */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="section-filter" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                            Section (optional)
                        </label>
                        <select
                            id="section-filter"
                            value={activeFilters.section_id ?? ''}
                            onChange={(e) => updateFilter({ section_id: e.target.value === '' ? '' : Number(e.target.value) })}
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                        >
                            <option value="">All Sections</option>
                            {sections.map((sec) => (
                                <option key={sec.id} value={sec.id}>
                                    {sec.grade_level ? `${sec.grade_level.name} ` : ''}{sec.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Content ─────────────────────────────────────────────────── */}
            {report ? (
                <div className="flex-1 space-y-6 p-4">

                    {/* Summary cards */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <SummaryCard
                                key={card.key}
                                label={card.label}
                                value={report.summary[card.key]}
                                icon={card.icon}
                                colorClass={card.colorClass}
                                bgClass={card.bgClass}
                            />
                        ))}
                    </div>

                    {/*
                     * ── HOW EACH CHART WORKS ─────────────────────────────────────
                     *
                     * DAILY  — groups all logs by calendar date (YYYY-MM-DD).
                     *          Each bar pair = one day. Good for spotting day-to-day
                     *          fluctuations in attendance patterns.
                     *
                     * WEEKLY — groups by ISO week (YYYY-Www). Each pair spans Mon–Sun.
                     *          Lets you compare how busier the school is week-by-week.
                     *
                     * MONTHLY — groups by year-month (YYYY-MM). Macro-level trend.
                     *           Ideal for term/semester-level analysis.
                     *
                     * PER STUDENT — one bar pair per student. Shows which individual
                     *               students have the most / fewest scanned events.
                     *
                     * PER SECTION — one bar pair per class section. Shows which
                     *               section has the highest attendance participation.
                     *
                     * In all charts: GREEN = check-ins, ORANGE = check-outs.
                     * Hover over any bar to see the exact count in a tooltip.
                     * ─────────────────────────────────────────────────────────────
                     */}

                    {/* Daily */}
                    <ChartCard
                        title="Daily Report"
                        description="Check-ins and check-outs grouped by calendar day. Hover any bar for exact counts."
                        data={report.daily}
                        maxLabelLength={10}
                    />

                    {/* Weekly */}
                    <ChartCard
                        title="Weekly Report"
                        description="Grouped by ISO week (Mon–Sun). Compare attendance patterns week over week."
                        data={report.weekly}
                        maxLabelLength={16}
                    />

                    {/* Monthly */}
                    <ChartCard
                        title="Monthly Report"
                        description="Macro-level view by calendar month. Identify semester trends at a glance."
                        data={report.monthly}
                        maxLabelLength={12}
                    />

                    {/* Per Student */}
                    <ChartCard
                        title="Per-Student Report"
                        description="Total events per individual student. Identify students with low or high scan activity."
                        data={report.per_student}
                        maxLabelLength={14}
                    />

                    {/* Per Section */}
                    <ChartCard
                        title="Per-Section Report"
                        description="Aggregated events per class section. Compare section-level attendance participation."
                        data={report.per_section}
                        maxLabelLength={14}
                    />

                </div>
            ) : (
                /* Empty / initial state */
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                        <BarChart3 size={28} />
                    </div>
                    <p className="text-base font-semibold text-[var(--foreground)]">
                        No report generated yet
                    </p>
                    <p className="max-w-sm text-sm text-[var(--muted-foreground)]">
                        Set a <strong>date range</strong> (and optionally filter by student or section),
                        then click <strong>Generate Report</strong> to instantly view all five charts.
                    </p>
                </div>
            )}
        </div>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reports & Analytics', href: '/admin/reports' },
    ],
};
