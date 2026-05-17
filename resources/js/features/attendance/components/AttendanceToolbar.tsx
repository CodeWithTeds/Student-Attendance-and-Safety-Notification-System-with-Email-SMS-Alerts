import { CalendarDays, Download, Search, X } from 'lucide-react';
import type { AttendanceEventType, AttendanceFilters } from '../types';

interface AttendanceToolbarProps {
    filters: AttendanceFilters;
    sections?: any[];
    selectedCount: number;
    onFilterChange: (filters: AttendanceFilters) => void;
    onClear: () => void;
    onExport: () => void;
}

export function AttendanceToolbar({
    filters,
    sections = [],
    selectedCount,
    onFilterChange,
    onClear,
    onExport,
}: AttendanceToolbarProps) {
    return (
        <div className="border-b border-[var(--border)] bg-[var(--background)] p-4">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[var(--foreground)]">
                        Attendance Management
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        View records, update attendance entries, and review edit history.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onExport}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={selectedCount === 0}
                >
                    <Download size={16} />
                    Export Selected
                </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_180px_auto]">
                <label className="relative">
                    <Search
                        size={16}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                    />
                    <input
                        type="search"
                        value={filters.search ?? ''}
                        onChange={(event) =>
                            onFilterChange({ ...filters, search: event.target.value })
                        }
                        placeholder="Search student, email, or number"
                        className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition focus:border-[var(--primary)]"
                    />
                </label>

                <select
                    value={filters.section_id ?? ''}
                    onChange={(event) =>
                        onFilterChange({
                            ...filters,
                            section_id: event.target.value,
                        })
                    }
                    className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                >
                    <option value="">All sections</option>
                    {sections.map((section: any) => (
                        <option key={section.id} value={section.id}>
                            {section.grade_level?.name ? `${section.grade_level.name} - ` : ''}{section.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.event_type ?? ''}
                    onChange={(event) =>
                        onFilterChange({
                            ...filters,
                            event_type: event.target.value as AttendanceEventType | '',
                        })
                    }
                    className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                >
                    <option value="">All events</option>
                    <option value="check_in">Time In</option>
                    <option value="check_out">Time Out</option>
                </select>

                <label className="relative">
                    <CalendarDays
                        size={16}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                    />
                    <input
                        type="date"
                        value={filters.date ?? ''}
                        onChange={(event) =>
                            onFilterChange({ ...filters, date: event.target.value })
                        }
                        className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition focus:border-[var(--primary)]"
                    />
                </label>

                <button
                    type="button"
                    onClick={onClear}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                    <X size={15} />
                    Clear
                </button>
            </div>
        </div>
    );
}
