import { History, X } from 'lucide-react';
import type { AttendanceRecord } from '../types';

interface AttendanceHistoryPanelProps {
    record: AttendanceRecord | null;
    onClose: () => void;
}

export function AttendanceHistoryPanel({ record, onClose }: AttendanceHistoryPanelProps) {
    if (!record) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
            <aside className="flex h-full w-full max-w-xl flex-col bg-[var(--background)] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                            <History size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[var(--foreground)]">
                                Attendance History
                            </h2>
                            <p className="text-sm text-[var(--muted-foreground)]">
                                {record.student.name}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="border-b border-[var(--border)] p-5">
                    <p className="text-xs font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                        Current record
                    </p>
                    <div className="mt-2 rounded-xl bg-[var(--muted)]/40 p-4">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                            {record.event_label} at {record.scanned_at_full_display}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            Student number: {record.student.student_number ?? 'Not set'}
                        </p>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                    {record.edit_history.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <History size={34} className="mb-3 text-[var(--muted-foreground)]" />
                            <p className="text-sm font-semibold text-[var(--foreground)]">
                                No edits yet
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                                Corrections made to this attendance record will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {record.edit_history.map((entry) => (
                                <article
                                    key={entry.id}
                                    className="rounded-xl border border-[var(--border)] p-4"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-bold text-[var(--foreground)]">
                                                {entry.old_event_label} to {entry.new_event_label}
                                            </p>
                                            <p className="text-xs text-[var(--muted-foreground)]">
                                                Edited {entry.created_at_display}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                                            {entry.editor?.name ?? 'System'}
                                        </span>
                                    </div>
                                    <div className="grid gap-3 text-xs sm:grid-cols-2">
                                        <div className="rounded-lg bg-[var(--muted)]/40 p-3">
                                            <p className="font-semibold text-[var(--muted-foreground)]">
                                                Previous
                                            </p>
                                            <p className="mt-1 text-[var(--foreground)]">
                                                {entry.old_scanned_at_display}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-[var(--muted)]/40 p-3">
                                            <p className="font-semibold text-[var(--muted-foreground)]">
                                                Updated
                                            </p>
                                            <p className="mt-1 text-[var(--foreground)]">
                                                {entry.new_scanned_at_display}
                                            </p>
                                        </div>
                                    </div>
                                    {entry.note && (
                                        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                                            {entry.note}
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
