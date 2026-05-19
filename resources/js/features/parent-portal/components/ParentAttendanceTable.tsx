import type { AttendanceMeta } from '@/features/attendance/types';
import type { GuardianAttendanceRecord, GuardianProfile } from '@/features/parent-portal/types';
import { BellRing, CalendarClock, ClipboardList, LogIn, LogOut, Mail, MessageSquareText } from 'lucide-react';

interface Props {
    records: GuardianAttendanceRecord[];
    meta: AttendanceMeta;
    guardian?: GuardianProfile;
    showChannels?: boolean;
}

export default function ParentAttendanceTable({ records, meta, guardian, showChannels = false }: Props) {
    return (
        <div className="flex-1 overflow-auto bg-[var(--background)] px-4">
            <table className="w-full min-w-[1040px] border-collapse text-[13px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">#</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Student</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Attendance</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Date & Time</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Schedule</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Section</th>
                        {showChannels && (
                            <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Alerts</th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {records.length === 0 ? (
                        <tr>
                            <td colSpan={showChannels ? 7 : 6}>
                                <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                                    <ClipboardList size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-medium">No attendance records found.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        records.map((record, index) => {
                            const section = record.student.current_section;
                            const schedule = record.schedule ?? section?.schedule ?? null;
                            const isLate = record.schedule_status === 'Late';
                            const isTimeIn = record.event_type === 'check_in';

                            return (
                                <tr key={record.id} className="transition-colors hover:bg-[var(--accent)]/30">
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">{(meta.from ?? 0) + index}</td>
                                    <td className="px-2 py-2.5">
                                        <p className="font-medium text-[var(--foreground)]">{record.student.name}</p>
                                        <p className="text-[11px] font-medium text-[var(--muted-foreground)]">{record.student.student_number ?? 'No student number'}</p>
                                    </td>
                                    <td className="px-2 py-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm ${isTimeIn ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {isTimeIn ? <LogIn size={14} /> : <LogOut size={14} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--foreground)]">{isLate ? 'Late Time In' : record.event_label}</p>
                                                <div className="mt-1 flex flex-wrap gap-1.5">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${isTimeIn ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {record.status_label}
                                                    </span>
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${isLate ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {record.schedule_status}
                                                    </span>
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
                                            <span className="font-medium">{schedule ? `${schedule.time_in_display} - ${schedule.time_out_display}` : 'No schedule'}</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">
                                        {section ? `${section.grade_level?.name ?? ''} ${section.name}`.trim() : 'Not assigned'}
                                    </td>
                                    {showChannels && (
                                        <td className="px-2 py-2.5">
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${guardian?.notification_sms_enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    <MessageSquareText size={11} />
                                                    SMS {guardian?.notification_sms_enabled ? 'enabled' : 'off'}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${guardian?.notification_email_enabled ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    <Mail size={11} />
                                                    Email {guardian?.notification_email_enabled ? 'enabled' : 'off'}
                                                </span>
                                                {isLate && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                                                        <BellRing size={11} />
                                                        Late alert
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
