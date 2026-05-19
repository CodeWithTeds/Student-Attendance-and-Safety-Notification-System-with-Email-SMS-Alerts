import { CalendarClock, ClipboardList, History, LogIn, LogOut } from 'lucide-react';
import type { AttendanceMeta } from '@/features/attendance/types';
import type { StudentAttendanceRecord } from '../types';

interface Props {
    records: StudentAttendanceRecord[];
    selected: number[];
    onToggleAll: () => void;
    onToggleOne: (id: number) => void;
    meta: AttendanceMeta;
}

export default function StudentAttendanceTable({ records, selected, onToggleAll, onToggleOne, meta }: Props) {
    const allSelected = records.length > 0 && records.every((record) => selected.includes(record.id));

    return (
        <div className="flex-1 overflow-auto bg-[var(--background)] px-4">
            <table className="w-full min-w-[980px] border-collapse text-[13px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-1 py-3 text-left">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                checked={allSelected}
                                onChange={onToggleAll}
                            />
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">#</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Attendance</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Date & Time</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Schedule</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Section</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">History</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {records.length === 0 ? (
                        <tr>
                            <td colSpan={7}>
                                <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                                    <ClipboardList size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-medium">No attendance records found.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        records.map((record, index) => {
                            const isSelected = selected.includes(record.id);
                            const section = record.student.current_section;
                            const schedule = record.schedule ?? section?.schedule ?? null;
                            const isLate = record.schedule_status === 'Late';

                            return (
                                <tr
                                    key={record.id}
                                    className={`transition-colors hover:bg-[var(--accent)]/30 ${isSelected ? 'bg-[var(--accent)]/50' : ''}`}
                                >
                                    <td className="px-1 py-2.5">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                            checked={isSelected}
                                            onChange={() => onToggleOne(record.id)}
                                        />
                                    </td>
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">{(meta.from ?? 0) + index}</td>
                                    <td className="px-2 py-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm ${
                                                record.event_type === 'check_in'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {record.event_type === 'check_in' ? <LogIn size={14} /> : <LogOut size={14} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--foreground)]">
                                                    {isLate ? 'Late Time In' : record.event_label}
                                                </p>
                                                <div className="mt-1 flex flex-wrap gap-1.5">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                        record.event_type === 'check_in'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {record.status_label}
                                                    </span>
                                                    {record.schedule_status && (
                                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                            isLate ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {record.schedule_status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2.5">
                                        <p className="font-medium text-[var(--foreground)]">{record.scanned_at_full_display}</p>
                                        <p className="text-[11px] font-medium text-[var(--muted-foreground)]">{record.scanned_at_display}</p>
                                    </td>
                                    <td className="px-2 py-2.5">
                                        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                                            <CalendarClock size={14} />
                                            <span className="font-medium">
                                                {schedule ? `${schedule.time_in_display} - ${schedule.time_out_display}` : 'No schedule'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">
                                        {section ? `${section.grade_level?.name ?? ''} ${section.name}`.trim() : 'Not assigned'}
                                    </td>
                                    <td className="px-2 py-2.5">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--secondary-foreground)]">
                                            <History size={11} />
                                            {record.edit_history.length} edits
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
