import { router } from '@inertiajs/react';
import { CalendarClock, Save, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AttendanceEventType, AttendanceRecord } from '../types';

interface EditAttendanceModalProps {
    record: AttendanceRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

function toDateTimeLocal(value: string): string {
    const date = new Date(value);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return offsetDate.toISOString().slice(0, 16);
}

export function EditAttendanceModal({ record, isOpen, onClose }: EditAttendanceModalProps) {
    if (!isOpen || !record) {
        return null;
    }

    return <EditAttendanceForm key={record.id} record={record} onClose={onClose} />;
}

interface EditAttendanceFormProps {
    record: AttendanceRecord;
    onClose: () => void;
}

function EditAttendanceForm({ record, onClose }: EditAttendanceFormProps) {
    const [eventType, setEventType] = useState<AttendanceEventType>(record.event_type);
    const [scannedAt, setScannedAt] = useState(toDateTimeLocal(record.scanned_at));
    const [note, setNote] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProcessing(true);

        router.put(
            `/admin/attendance/${record.id}`,
            {
                event_type: eventType,
                scanned_at: scannedAt,
                note,
            },
            {
                preserveScroll: true,
                onSuccess: onClose,
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                            <CalendarClock size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[var(--foreground)]">
                                Edit Attendance
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

                <div className="space-y-4 p-5">
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                            Attendance event
                        </span>
                        <select
                            value={eventType}
                            onChange={(event) => setEventType(event.target.value as AttendanceEventType)}
                            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                        >
                            <option value="check_in">Check-in</option>
                            <option value="check_out">Check-out</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                            Scanned date and time
                        </span>
                        <input
                            type="datetime-local"
                            value={scannedAt}
                            onChange={(event) => setScannedAt(event.target.value)}
                            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                            Edit note
                        </span>
                        <textarea
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            rows={3}
                            maxLength={255}
                            placeholder="Reason for correction"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none transition focus:border-[var(--primary)]"
                        />
                    </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] p-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
