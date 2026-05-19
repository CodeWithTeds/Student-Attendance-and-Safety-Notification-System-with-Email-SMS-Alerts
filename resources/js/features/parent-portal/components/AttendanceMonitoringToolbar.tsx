import type { GuardianChild, GuardianFilters } from '@/features/parent-portal/types';
import { Download, Filter, RotateCcw, Search } from 'lucide-react';

interface Props {
    filters: GuardianFilters;
    childrenOptions: GuardianChild[];
    onFilterChange: (key: keyof GuardianFilters, value: string) => void;
    onApply: () => void;
    onReset: () => void;
    onExport: () => void;
}

export default function AttendanceMonitoringToolbar({ filters, childrenOptions, onFilterChange, onApply, onReset, onExport }: Props) {
    const period = filters.period ?? 'daily';

    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] bg-[var(--background)] p-4">
            <div className="relative min-w-[190px] max-w-[280px] flex-1">
                <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-[13px] text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                    placeholder="Search child or ID..."
                    value={filters.search ?? ''}
                    onChange={(event) => onFilterChange('search', event.target.value)}
                />
            </div>

            <select
                className="h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                value={period}
                onChange={(event) => onFilterChange('period', event.target.value)}
            >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
            </select>

            {period === 'monthly' ? (
                <input
                    className="h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                    type="month"
                    value={filters.month ?? ''}
                    onChange={(event) => onFilterChange('month', event.target.value)}
                />
            ) : (
                <input
                    className="h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                    type="date"
                    value={filters.date ?? ''}
                    onChange={(event) => onFilterChange('date', event.target.value)}
                />
            )}

            <select
                className="h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                value={filters.student_id ?? ''}
                onChange={(event) => onFilterChange('student_id', event.target.value)}
            >
                <option value="">All children</option>
                {childrenOptions.map((child) => (
                    <option key={child.id} value={child.id}>
                        {child.name}
                    </option>
                ))}
            </select>

            <select
                className="h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                value={filters.event_type ?? ''}
                onChange={(event) => onFilterChange('event_type', event.target.value)}
            >
                <option value="">All events</option>
                <option value="check_in">Time In</option>
                <option value="check_out">Time Out</option>
            </select>

            <div className="flex-1" />

            <button
                onClick={onReset}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
            >
                <RotateCcw size={14} /> Reset
            </button>
            <button
                onClick={onApply}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 text-[13px] font-medium text-[var(--primary-foreground)] shadow-sm transition-colors hover:opacity-90"
            >
                <Filter size={14} /> Apply
            </button>
            <button
                onClick={onExport}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
            >
                <Download size={14} /> Export
            </button>
        </div>
    );
}
