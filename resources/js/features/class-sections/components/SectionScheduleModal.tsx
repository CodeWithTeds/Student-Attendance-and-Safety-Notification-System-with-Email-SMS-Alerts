import { useForm } from '@inertiajs/react';
import { CalendarClock, Save, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Section, SectionScheduleForm } from '../types';

interface Props {
    isOpen: boolean;
    section: Section | null;
    onClose: () => void;
}

const initialForm: SectionScheduleForm = {
    time_in: '',
    time_out: '',
};

export default function SectionScheduleModal({
    isOpen,
    section,
    onClose,
}: Props) {
    const {
        data,
        setData,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<SectionScheduleForm>(initialForm);

    useEffect(() => {
        if (section && isOpen) {
            setData({
                time_in: section.schedule?.time_in?.slice(0, 5) ?? '',
                time_out: section.schedule?.time_out?.slice(0, 5) ?? '',
            });
        }
    }, [section, isOpen, setData]);

    if (!isOpen || !section) {
        return null;
    }

    const sectionLabel = `${section.grade_level?.name ?? 'Section'} - ${section.name}`;

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/admin/sections/${section.id}/schedule`, {
            preserveScroll: true,
            onSuccess: handleClose,
        });
    };

    const handleRemove = () => {
        if (
            !section.schedule ||
            !confirm(`Remove the schedule for ${sectionLabel}?`)
        ) {
            return;
        }

        destroy(`/admin/sections/${section.id}/schedule`, {
            preserveScroll: true,
            onSuccess: handleClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <form
                className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                    <div>
                        <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]">
                            <CalendarClock
                                className="text-[var(--primary)]"
                                size={22}
                            />
                            Section Schedule
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            Set class time in and time out for {sectionLabel}.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
                        aria-label="Close schedule modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">
                            Time in
                        </label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            type="time"
                            value={data.time_in}
                            onChange={(event) =>
                                setData('time_in', event.target.value)
                            }
                            required
                        />
                        {errors.time_in && (
                            <span className="text-[11px] font-medium text-red-500">
                                {errors.time_in}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">
                            Time out
                        </label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            type="time"
                            value={data.time_out}
                            onChange={(event) =>
                                setData('time_out', event.target.value)
                            }
                            required
                        />
                        {errors.time_out && (
                            <span className="text-[11px] font-medium text-red-500">
                                {errors.time_out}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] p-4">
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={!section.schedule || processing}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Trash2 size={14} />
                        Remove
                    </button>
                    <div className="flex items-center gap-2">
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
                            {processing ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
