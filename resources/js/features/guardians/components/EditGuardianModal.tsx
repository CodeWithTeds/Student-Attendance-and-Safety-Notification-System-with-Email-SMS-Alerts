import { useForm } from '@inertiajs/react';
import { HeartPulse, Mail, MessageSquareText, Save, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { Guardian, GuardianForm, StudentOption } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    guardian: Guardian | null;
    students: StudentOption[];
}

const emptyForm: GuardianForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    guardian_phone: '',
    notification_sms_enabled: false,
    notification_email_enabled: false,
    student_ids: [],
};

export default function EditGuardianModal({
    isOpen,
    onClose,
    guardian,
    students,
}: Props) {
    const {
        data: form,
        setData,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<GuardianForm>(emptyForm);

    useEffect(() => {
        if (guardian && isOpen) {
            setData({
                name: guardian.name || '',
                email: guardian.email || '',
                password: '',
                password_confirmation: '',
                first_name: guardian.first_name || '',
                middle_name: guardian.middle_name || '',
                last_name: guardian.last_name || '',
                guardian_phone: guardian.guardian_phone || '',
                notification_sms_enabled: guardian.notification_sms_enabled,
                notification_email_enabled: guardian.notification_email_enabled,
                student_ids: (guardian.children ?? []).map(
                    (student) => student.id,
                ),
            });
        }
    }, [guardian, isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    const toggleStudent = (studentId: number) => {
        setData(
            'student_ids',
            form.student_ids.includes(studentId)
                ? form.student_ids.filter((id) => id !== studentId)
                : [...form.student_ids, studentId],
        );
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!guardian) return;

        put(`/admin/parents/${guardian.id}`, {
            preserveScroll: true,
            onSuccess: handleClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <form
                className="flex max-h-[86vh] w-full max-w-[980px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                    <div>
                        <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]">
                            <HeartPulse
                                className="text-[var(--primary)]"
                                size={22}
                            />
                            Edit Parent / Guardian
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            Update contact details, linked students, and
                            notification channels.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
                        aria-label="Close edit guardian modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Display name
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={form.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                placeholder="Maria Dela Cruz"
                                required
                            />
                            {errors.name && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                First name
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={form.first_name}
                                onChange={(event) =>
                                    setData('first_name', event.target.value)
                                }
                                placeholder="Maria"
                            />
                            {errors.first_name && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.first_name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Middle name
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={form.middle_name}
                                onChange={(event) =>
                                    setData('middle_name', event.target.value)
                                }
                                placeholder="Santos"
                            />
                            {errors.middle_name && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.middle_name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Last name
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={form.last_name}
                                onChange={(event) =>
                                    setData('last_name', event.target.value)
                                }
                                placeholder="Dela Cruz"
                            />
                            {errors.last_name && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.last_name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                SMS contact number
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={form.guardian_phone}
                                onChange={(event) =>
                                    setData(
                                        'guardian_phone',
                                        event.target.value,
                                    )
                                }
                                placeholder="09XXXXXXXXX"
                            />
                            {errors.guardian_phone && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.guardian_phone}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Email
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                type="email"
                                value={form.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                placeholder="guardian@example.com"
                                required
                            />
                            {errors.email && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                New password
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                type="password"
                                value={form.password}
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                placeholder="Optional"
                            />
                            {errors.password && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Confirm password
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                type="password"
                                value={form.password_confirmation}
                                onChange={(event) =>
                                    setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                placeholder="Optional"
                            />
                            {errors.password_confirmation && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.password_confirmation}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Notifications
                            </label>
                            <div className="flex flex-wrap gap-3">
                                <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm text-[var(--foreground)]">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                        checked={form.notification_sms_enabled}
                                        onChange={(event) =>
                                            setData(
                                                'notification_sms_enabled',
                                                event.target.checked,
                                            )
                                        }
                                    />
                                    <MessageSquareText size={14} />
                                    SMS
                                </label>
                                <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm text-[var(--foreground)]">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                        checked={
                                            form.notification_email_enabled
                                        }
                                        onChange={(event) =>
                                            setData(
                                                'notification_email_enabled',
                                                event.target.checked,
                                            )
                                        }
                                    />
                                    <Mail size={14} />
                                    Email
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Linked students
                            </label>
                            <div className="max-h-44 overflow-y-auto rounded-lg border border-[var(--border)] p-3">
                                {students.length === 0 ? (
                                    <p className="text-xs text-[var(--muted-foreground)]">
                                        No students available.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                        {students.map((student) => (
                                            <label
                                                key={student.id}
                                                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]/40"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                                    checked={form.student_ids.includes(
                                                        student.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleStudent(
                                                            student.id,
                                                        )
                                                    }
                                                />
                                                <span className="min-w-0 flex-1 truncate">
                                                    {student.name}
                                                </span>
                                                <span className="font-mono text-[11px] text-[var(--muted-foreground)]">
                                                    {student.student_number ??
                                                        'Pending'}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.student_ids && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.student_ids}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] p-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] shadow-sm transition-colors hover:opacity-90 disabled:opacity-50"
                    >
                        <Save size={14} />
                        {processing ? 'Saving...' : 'Update Guardian'}
                    </button>
                </div>
            </form>
        </div>
    );
}
