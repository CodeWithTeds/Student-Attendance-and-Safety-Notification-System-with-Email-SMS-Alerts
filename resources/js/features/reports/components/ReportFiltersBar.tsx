import { BarChart3, CalendarDays, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import type { DropdownSection, DropdownStudent, ReportFilters, ReportType } from '../types';
import { REPORT_TYPE_LABELS } from '../types';

interface ReportFiltersBarProps {
    filters: ReportFilters;
    students: DropdownStudent[];
    sections: DropdownSection[];
    isLoading: boolean;
    onGenerate: (filters: ReportFilters) => void;
    onClear: () => void;
}

const REPORT_TYPES: ReportType[] = ['daily', 'weekly', 'monthly', 'per_student', 'per_section'];

function getDefaultFilters(): ReportFilters {
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

export function ReportFiltersBar({
    filters,
    students,
    sections,
    isLoading,
    onGenerate,
    onClear,
}: ReportFiltersBarProps) {
    const [local, setLocal] = useState<ReportFilters>(filters ?? getDefaultFilters());

    const set = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) =>
        setLocal((prev) => ({ ...prev, [key]: value }));

    const showStudentFilter = local.report_type === 'per_student';
    const showSectionFilter = local.report_type === 'per_section';

    return (
        <div className="border-b border-[var(--border)] bg-[var(--background)] p-4">
            {/* Header row */}
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[var(--foreground)]">Reports &amp; Analytics</h1>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Generate daily, weekly, monthly, per-student, and per-section attendance reports.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onClear}
                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                        <X size={15} />
                        Clear
                    </button>

                    <button
                        id="generate-report-btn"
                        type="button"
                        onClick={() => onGenerate(local)}
                        disabled={isLoading}
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? (
                            <RefreshCw size={15} className="animate-spin" />
                        ) : (
                            <BarChart3 size={15} />
                        )}
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Filter controls */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Report type */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                        Report Type
                    </label>
                    <select
                        id="report-type-select"
                        value={local.report_type}
                        onChange={(e) => set('report_type', e.target.value as ReportType)}
                        className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                    >
                        {REPORT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {REPORT_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date from */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                        Date From
                    </label>
                    <div className="relative">
                        <CalendarDays
                            size={15}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                        />
                        <input
                            id="date-from-input"
                            type="date"
                            value={local.date_from}
                            onChange={(e) => set('date_from', e.target.value)}
                            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition focus:border-[var(--primary)]"
                        />
                    </div>
                </div>

                {/* Date to */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                        Date To
                    </label>
                    <div className="relative">
                        <CalendarDays
                            size={15}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                        />
                        <input
                            id="date-to-input"
                            type="date"
                            value={local.date_to}
                            onChange={(e) => set('date_to', e.target.value)}
                            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition focus:border-[var(--primary)]"
                        />
                    </div>
                </div>

                {/* Conditional: student or section filter */}
                {showStudentFilter && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                            Filter by Student
                        </label>
                        <select
                            id="student-filter-select"
                            value={local.student_id ?? ''}
                            onChange={(e) =>
                                set('student_id', e.target.value === '' ? '' : Number(e.target.value))
                            }
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                        >
                            <option value="">All Students</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                    {s.student_number ? ` (${s.student_number})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {showSectionFilter && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                            Filter by Section
                        </label>
                        <select
                            id="section-filter-select"
                            value={local.section_id ?? ''}
                            onChange={(e) =>
                                set('section_id', e.target.value === '' ? '' : Number(e.target.value))
                            }
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                        >
                            <option value="">All Sections</option>
                            {sections.map((sec) => (
                                <option key={sec.id} value={sec.id}>
                                    {sec.grade_level ? `${sec.grade_level.name} ` : ''}
                                    {sec.name}
                                    {sec.school_year ? ` — ${sec.school_year}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}
