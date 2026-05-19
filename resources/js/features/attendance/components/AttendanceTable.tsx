import { Check, History, Pencil, UserCheck } from 'lucide-react';
import type { AttendanceMeta, AttendanceRecord } from '../types';

interface AttendanceTableProps {
    records: AttendanceRecord[];
    selected: number[];
    meta: AttendanceMeta;
    onToggleAll: () => void;
    onToggleOne: (id: number) => void;
    onEdit: (record: AttendanceRecord) => void;
    onViewHistory: (record: AttendanceRecord) => void;
}

export function AttendanceTable({
    records,
    selected,
    meta,
    onToggleAll,
    onToggleOne,
    onEdit,
    onViewHistory,
}: AttendanceTableProps) {
    const allSelected =
        records.length > 0 &&
        records.every((record) => selected.includes(record.id));

    return (
        <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full min-w-[980px] border-collapse">
                <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--muted)]/35 text-left">
                        <th className="w-12 px-4 py-3">
                            <button
                                type="button"
                                onClick={onToggleAll}
                                className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                                    allSelected
                                        ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                                        : 'border-[var(--border)] bg-[var(--background)]'
                                }`}
                                aria-label="Select all records"
                            >
                                {allSelected && (
                                    <Check size={13} strokeWidth={3} />
                                )}
                            </button>
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Student
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Event
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Scanned At
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Section / Schedule
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            History
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {records.map((record) => {
                        const isSelected = selected.includes(record.id);
                        const section = record.student.current_section;
                        const schedule = record.schedule ?? section?.schedule ?? null;

                        return (
                            <tr
                                key={record.id}
                                className="transition-colors hover:bg-[var(--muted)]/30"
                            >
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => onToggleOne(record.id)}
                                        className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                                            isSelected
                                                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                                                : 'border-[var(--border)] bg-[var(--background)]'
                                        }`}
                                        aria-label={`Select attendance record ${record.id}`}
                                    >
                                        {isSelected && (
                                            <Check size={13} strokeWidth={3} />
                                        )}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                                            <UserCheck size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--foreground)]">
                                                {record.student.name}
                                            </p>
                                            <p className="text-xs text-[var(--muted-foreground)]">
                                                {record.student
                                                    .student_number ??
                                                    record.student.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col items-start gap-1">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                record.event_type === 'check_in'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                                            }`}
                                        >
                                            {record.event_label}
                                        </span>
                                        {record.schedule_status && (
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                    record.schedule_status === 'Late'
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                                }`}
                                            >
                                                {record.schedule_status}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-[var(--foreground)]">
                                    {record.scanned_at_full_display}
                                </td>
                                <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                                    {section ? (
                                        <>
                                            <div>
                                                {`${section.grade_level?.name ?? ''} ${section.name}`.trim()}
                                            </div>
                                            <div className="mt-0.5 text-xs">
                                                {schedule
                                                    ? `${schedule.time_in_display} - ${schedule.time_out_display}`
                                                    : 'No schedule'}
                                            </div>
                                        </>
                                    ) : (
                                        'Not assigned'
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => onViewHistory(record)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                    >
                                        <History size={14} />
                                        {record.edit_history.length} edits
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(record)}
                                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {meta.total === 0 && (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                    <UserCheck
                        size={36}
                        className="mb-3 text-[var(--muted-foreground)]"
                    />
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                        No attendance records found
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Scanned QR attendance records will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
