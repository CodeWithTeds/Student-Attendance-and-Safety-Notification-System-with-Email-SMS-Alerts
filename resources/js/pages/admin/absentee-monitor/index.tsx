import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarDays,
    Clock,
    Eye,
    RefreshCw,
    RotateCcw,
    Search,
    UserX,
    Users,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type {
    AbsenteeDropdownSection,
    AbsenteeDropdownStudent,
    AbsenteeMonitorFilters,
    AbsenteeMonitorRow,
    AbsenteeMonitorSummary,
} from '@/features/absentee-monitor/types';

interface Props {
    sections: AbsenteeDropdownSection[];
    students: AbsenteeDropdownStudent[];
    filters: AbsenteeMonitorFilters;
    summary: AbsenteeMonitorSummary;
    rows: AbsenteeMonitorRow[];
}

const fieldControlClass =
    'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]';

function defaultFilters(): AbsenteeMonitorFilters {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
        date_from: firstDay.toISOString().slice(0, 10),
        date_to: today.toISOString().slice(0, 10),
        student_id: '',
        section_id: '',
        absence_threshold: 3,
        late_threshold: 3,
    };
}

function cleanFilters(filters: AbsenteeMonitorFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters)
            .filter(([, value]) => value !== '' && value !== undefined && value !== null)
            .map(([key, value]) => [key, String(value)]),
    );
}

export default function AbsenteeMonitorIndex({
    sections,
    students,
    filters,
    summary,
    rows,
}: Props) {
    const [activeFilters, setActiveFilters] = useState<AbsenteeMonitorFilters>({
        ...defaultFilters(),
        ...filters,
    });
    const [isLoading, setIsLoading] = useState(false);
    const hasMounted = useRef(false);
    const skipNextAutoRefresh = useRef(false);

    const syncMonitor = useCallback((filtersToSync: AbsenteeMonitorFilters) => {
        setIsLoading(true);
        router.get('/admin/absentee-monitor', cleanFilters(filtersToSync), {
            only: ['filters', 'summary', 'rows'],
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onCancel: () => setIsLoading(false),
            onFinish: () => setIsLoading(false),
        });
    }, []);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;

            return;
        }

        if (skipNextAutoRefresh.current) {
            skipNextAutoRefresh.current = false;

            return;
        }

        if (!activeFilters.date_from || !activeFilters.date_to) {
            return;
        }

        const timeout = window.setTimeout(() => {
            syncMonitor(activeFilters);
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [activeFilters, syncMonitor]);

    const updateFilter = <K extends keyof AbsenteeMonitorFilters>(
        key: K,
        value: AbsenteeMonitorFilters[K],
    ) => {
        setActiveFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const resetFilters = () => {
        const nextFilters = defaultFilters();
        skipNextAutoRefresh.current = true;
        setActiveFilters(nextFilters);
        syncMonitor(nextFilters);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Absentee Monitor" />

            <div className="border-b border-[var(--border)] p-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-[var(--foreground)]">
                            Absentee Monitor
                        </h1>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            Track students with frequent absences or late check-ins.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => syncMonitor(activeFilters)}
                        disabled={isLoading}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <RefreshCw size={15} className="animate-spin" />
                        ) : (
                            <Eye size={15} />
                        )}
                        Refresh Now
                    </button>
                </div>
            </div>

            <div className="border-b border-[var(--border)] p-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                    <FilterField label="Date From">
                        <DateInput
                            value={activeFilters.date_from}
                            onChange={(value) => updateFilter('date_from', value)}
                        />
                    </FilterField>
                    <FilterField label="Date To">
                        <DateInput
                            value={activeFilters.date_to}
                            onChange={(value) => updateFilter('date_to', value)}
                        />
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
                    <FilterField label="Absence Threshold">
                        <input
                            type="number"
                            min={1}
                            max={60}
                            value={activeFilters.absence_threshold}
                            onChange={(event) =>
                                updateFilter('absence_threshold', Number(event.target.value))
                            }
                            className={fieldControlClass}
                        />
                    </FilterField>
                    <FilterField label="Late Threshold">
                        <input
                            type="number"
                            min={1}
                            max={60}
                            value={activeFilters.late_threshold}
                            onChange={(event) =>
                                updateFilter('late_threshold', Number(event.target.value))
                            }
                            className={fieldControlClass}
                        />
                    </FilterField>
                </div>

                <div className="mt-3 flex justify-end">
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                        <RotateCcw size={15} />
                        Reset
                    </button>
                </div>
            </div>

            <div className="grid gap-3 border-b border-[var(--border)] p-4 md:grid-cols-5">
                <SummaryPill icon={Users} label="Monitored" value={summary.monitored_students} />
                <SummaryPill icon={AlertTriangle} label="Flagged" value={summary.flagged_students} />
                <SummaryPill icon={UserX} label="Absences" value={summary.total_absences} />
                <SummaryPill icon={Clock} label="Late Records" value={summary.total_lates} />
                <SummaryPill icon={CalendarDays} label="School Days" value={summary.school_days} />
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-4">
                <table className="w-full min-w-[1120px] border-collapse text-[13px]">
                    <thead>
                        <tr className="border-b-2 border-[var(--border)]">
                            <HeaderCell>Student</HeaderCell>
                            <HeaderCell>Section</HeaderCell>
                            <HeaderCell>Absences</HeaderCell>
                            <HeaderCell>Late Records</HeaderCell>
                            <HeaderCell>Attendance</HeaderCell>
                            <HeaderCell>Risk</HeaderCell>
                            <HeaderCell>Recent Dates</HeaderCell>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                                        <Search size={44} className="mb-4 opacity-20" />
                                        <p className="text-sm font-medium">
                                            No students crossed the selected thresholds.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.student.id} className="hover:bg-[var(--accent)]/30">
                                    <td className="px-3 py-3">
                                        <div className="font-semibold text-[var(--foreground)]">
                                            {row.student.name}
                                        </div>
                                        <div className="text-xs text-[var(--muted-foreground)]">
                                            {row.student.student_number ?? row.student.email}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-sm text-[var(--foreground)]">
                                        <div>{row.section?.name ?? 'Unassigned'}</div>
                                        <div className="text-xs text-[var(--muted-foreground)]">
                                            Time in {row.section?.time_in?.slice(0, 5) ?? '-'}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <MetricBadge tone="red" value={row.absence_count} />
                                    </td>
                                    <td className="px-3 py-3">
                                        <MetricBadge tone="amber" value={row.late_count} />
                                    </td>
                                    <td className="px-3 py-3 text-sm text-[var(--foreground)]">
                                        {row.present_days} of {row.school_days} days present
                                    </td>
                                    <td className="px-3 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                row.risk_level === 'high'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            {row.risk_level === 'high' ? 'High Risk' : 'Watch'}
                                        </span>
                                    </td>
                                    <td className="max-w-[320px] px-3 py-3 text-xs text-[var(--muted-foreground)]">
                                        <DateList label="Absent" values={row.absence_dates} />
                                        <DateList
                                            label="Late"
                                            values={row.late_dates.map((date) => `${date.date} ${date.time}`)}
                                        />
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

function DateInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="relative">
            <CalendarDays
                size={15}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <input
                type="date"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={`${fieldControlClass} pl-9`}
            />
        </div>
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

function SummaryPill({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Users;
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
                {value.toLocaleString()}
            </div>
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

function MetricBadge({ tone, value }: { tone: 'red' | 'amber'; value: number }) {
    return (
        <span
            className={`inline-flex min-w-10 justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                tone === 'red'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
            }`}
        >
            {value}
        </span>
    );
}

function DateList({ label, values }: { label: string; values: string[] }) {
    if (values.length === 0) {
        return (
            <div>
                <span className="font-semibold text-[var(--foreground)]">{label}:</span> -
            </div>
        );
    }

    return (
        <div className="truncate">
            <span className="font-semibold text-[var(--foreground)]">{label}:</span>{' '}
            {values.join(', ')}
        </div>
    );
}

AbsenteeMonitorIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Absentee Monitor', href: '/admin/absentee-monitor' },
    ],
};
