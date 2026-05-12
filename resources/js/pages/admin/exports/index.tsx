import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    Download,
    FileSpreadsheet,
    FileText,
    RefreshCw,
    RotateCcw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type {
    ExportDropdownSection,
    ExportDropdownStudent,
    ExportFilters,
    ExportFormat,
    ExportReport,
    ExportReportType,
} from '@/features/exports/types';
import { REPORT_TYPE_LABELS } from '@/features/reports/types';

interface Props {
    sections: ExportDropdownSection[];
    students: ExportDropdownStudent[];
    filters: ExportFilters;
    report: ExportReport;
}

const reportTypes: ExportReportType[] = [
    'daily',
    'weekly',
    'monthly',
    'per_student',
    'per_section',
];

const fieldControlClass =
    'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]';

function defaultFilters(): ExportFilters {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
        report_type: 'daily',
        date_from: firstDay.toISOString().slice(0, 10),
        date_to: today.toISOString().slice(0, 10),
        student_id: '',
        section_id: '',
    };
}

function cleanFilters(filters: ExportFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters)
            .filter(([, value]) => value !== '' && value !== undefined && value !== null)
            .map(([key, value]) => [key, String(value)]),
    );
}

function columnLabel(reportType: ExportReportType): string {
    switch (reportType) {
        case 'daily':
            return 'Date';
        case 'weekly':
            return 'Week';
        case 'monthly':
            return 'Month';
        case 'per_student':
            return 'Student';
        case 'per_section':
            return 'Section';
    }
}

export default function ExportManagementIndex({
    sections,
    students,
    filters,
    report,
}: Props) {
    const [activeFilters, setActiveFilters] = useState<ExportFilters>({
        ...defaultFilters(),
        ...filters,
    });
    const [isLoading, setIsLoading] = useState(false);

    const updateFilter = <K extends keyof ExportFilters>(
        key: K,
        value: ExportFilters[K],
    ) => {
        setActiveFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const refreshPreview = () => {
        setIsLoading(true);
        router.get('/admin/exports', cleanFilters(activeFilters), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const resetFilters = () => {
        const nextFilters = defaultFilters();
        setActiveFilters(nextFilters);
        setIsLoading(true);
        router.get('/admin/exports', {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const exportUrl = (format: ExportFormat): string => {
        const params = new URLSearchParams({
            ...cleanFilters(activeFilters),
            format,
        });

        return `/admin/exports/attendance?${params.toString()}`;
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Export Management" />

            <div className="border-b border-[var(--border)] p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-[var(--foreground)]">
                            Export Management
                        </h1>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            Export attendance reports to CSV or PDF using report filters.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <ExportButton
                            href={exportUrl('csv')}
                            icon={FileSpreadsheet}
                            label="Export CSV"
                        />
                        <ExportButton
                            href={exportUrl('pdf')}
                            icon={FileText}
                            label="Export PDF"
                        />
                    </div>
                </div>
            </div>

            <div className="border-b border-[var(--border)] p-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <FilterField label="Report Type">
                        <select
                            value={activeFilters.report_type}
                            onChange={(event) =>
                                updateFilter('report_type', event.target.value as ExportReportType)
                            }
                            className={fieldControlClass}
                        >
                            {reportTypes.map((type) => (
                                <option key={type} value={type}>
                                    {REPORT_TYPE_LABELS[type]}
                                </option>
                            ))}
                        </select>
                    </FilterField>

                    <FilterField label="Date From">
                        <div className="relative">
                            <CalendarDays
                                size={15}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                            />
                            <input
                                type="date"
                                value={activeFilters.date_from}
                                onChange={(event) =>
                                    updateFilter('date_from', event.target.value)
                                }
                                className={`${fieldControlClass} pl-9`}
                            />
                        </div>
                    </FilterField>

                    <FilterField label="Date To">
                        <div className="relative">
                            <CalendarDays
                                size={15}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                            />
                            <input
                                type="date"
                                value={activeFilters.date_to}
                                onChange={(event) =>
                                    updateFilter('date_to', event.target.value)
                                }
                                className={`${fieldControlClass} pl-9`}
                            />
                        </div>
                    </FilterField>

                    <FilterField label="Student">
                        <select
                            value={activeFilters.student_id ?? ''}
                            onChange={(event) =>
                                updateFilter(
                                    'student_id',
                                    event.target.value === ''
                                        ? ''
                                        : Number(event.target.value),
                                )
                            }
                            className={fieldControlClass}
                        >
                            <option value="">All Students</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                    {student.student_number ? ` (${student.student_number})` : ''}
                                </option>
                            ))}
                        </select>
                    </FilterField>

                    <FilterField label="Section">
                        <select
                            value={activeFilters.section_id ?? ''}
                            onChange={(event) =>
                                updateFilter(
                                    'section_id',
                                    event.target.value === ''
                                        ? ''
                                        : Number(event.target.value),
                                )
                            }
                            className={fieldControlClass}
                        >
                            <option value="">All Sections</option>
                            {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.grade_level ? `${section.grade_level.name} ` : ''}
                                    {section.name}
                                    {section.school_year ? ` - ${section.school_year}` : ''}
                                </option>
                            ))}
                        </select>
                    </FilterField>
                </div>

                <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                        <RotateCcw size={15} />
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={refreshPreview}
                        disabled={isLoading}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <RefreshCw size={15} className="animate-spin" />
                        ) : (
                            <BarChart3 size={15} />
                        )}
                        Preview Report
                    </button>
                </div>
            </div>

            <div className="grid gap-3 border-b border-[var(--border)] p-4 md:grid-cols-4">
                <SummaryPill label="Total Records" value={report.summary.total_records} />
                <SummaryPill label="Check-ins" value={report.summary.total_check_ins} />
                <SummaryPill label="Check-outs" value={report.summary.total_check_outs} />
                <SummaryPill label="Unique Students" value={report.summary.unique_students} />
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-4">
                <table className="w-full min-w-[760px] border-collapse text-[13px]">
                    <thead>
                        <tr className="border-b-2 border-[var(--border)]">
                            <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                                {columnLabel(activeFilters.report_type)}
                            </th>
                            <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-right text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                                Check-ins
                            </th>
                            <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-right text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                                Check-outs
                            </th>
                            <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-right text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                                Total Events
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {report.rows.length === 0 ? (
                            <tr>
                                <td colSpan={4}>
                                    <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                                        <Download size={44} className="mb-4 opacity-20" />
                                        <p className="text-sm font-medium">
                                            No export rows for the selected filters.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            report.rows.map((row) => (
                                <tr key={row.label} className="hover:bg-[var(--accent)]/30">
                                    <td className="max-w-[520px] px-3 py-3 font-medium text-[var(--foreground)]">
                                        {row.label}
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                            {row.check_ins}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                                            {row.check_outs}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-right font-bold text-[var(--foreground)]">
                                        {row.total}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ExportButton({
    href,
    icon: Icon,
    label,
}: {
    href: string;
    icon: LucideIcon;
    label: string;
}) {
    return (
        <a
            href={href}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
            <Icon size={15} />
            {label}
        </a>
    );
}

function FilterField({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                {label}
            </span>
            {children}
        </label>
    );
}

function SummaryPill({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border border-[var(--border)] px-3 py-2">
            <div className="text-xs font-semibold text-[var(--muted-foreground)]">
                {label}
            </div>
            <div className="mt-1 text-lg font-bold text-[var(--foreground)]">
                {value.toLocaleString()}
            </div>
        </div>
    );
}

ExportManagementIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Export Management', href: '/admin/exports' },
    ],
};
