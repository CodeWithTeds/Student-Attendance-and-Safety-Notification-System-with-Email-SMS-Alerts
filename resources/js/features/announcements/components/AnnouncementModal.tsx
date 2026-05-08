import { useForm } from '@inertiajs/react';
import { Mail, Megaphone, MessageSquareText, Send, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type {
    AnnouncementAudienceType,
    AnnouncementForm,
    GuardianOption,
} from '../types';

interface Props {
    isOpen: boolean;
    guardians: GuardianOption[];
    onClose: () => void;
}

const initialForm: AnnouncementForm = {
    title: '',
    message: '',
    sms_enabled: false,
    email_enabled: true,
    audience_type: 'all_guardians',
    guardian_ids: [],
};

export default function AnnouncementModal({
    isOpen,
    guardians,
    onClose,
}: Props) {
    const [search, setSearch] = useState('');
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<AnnouncementForm>(initialForm);
    const formErrors = errors as typeof errors & { channels?: string };

    const filteredGuardians = useMemo(() => {
        const searchValue = search.toLowerCase();

        return guardians.filter((guardian) => {
            const children = (guardian.children ?? [])
                .map((child) => child.name.toLowerCase())
                .join(' ');

            return (
                guardian.name.toLowerCase().includes(searchValue) ||
                guardian.email.toLowerCase().includes(searchValue) ||
                (guardian.guardian_phone ?? '')
                    .toLowerCase()
                    .includes(searchValue) ||
                children.includes(searchValue)
            );
        });
    }, [guardians, search]);

    if (!isOpen) {
        return null;
    }

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
        setSearch('');
    };

    const setAudienceType = (audienceType: AnnouncementAudienceType) => {
        setData({
            ...data,
            audience_type: audienceType,
            guardian_ids:
                audienceType === 'all_guardians' ? [] : data.guardian_ids,
        });
    };

    const toggleGuardian = (guardianId: number) => {
        setData(
            'guardian_ids',
            data.guardian_ids.includes(guardianId)
                ? data.guardian_ids.filter((id) => id !== guardianId)
                : [...data.guardian_ids, guardianId],
        );
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/admin/announcements', {
            preserveScroll: true,
            onSuccess: handleClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                className="flex max-h-[88vh] w-full max-w-[920px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                    <div>
                        <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]">
                            <Megaphone
                                className="text-[var(--primary)]"
                                size={22}
                            />
                            Send Announcement
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            Send school announcements to parents and guardians
                            through SMS or email.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
                        aria-label="Close announcement modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 overflow-y-auto p-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Title
                            </label>
                            <input
                                value={data.title}
                                onChange={(event) =>
                                    setData('title', event.target.value)
                                }
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                required
                                maxLength={160}
                            />
                            {errors.title && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.title}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Message
                            </label>
                            <textarea
                                value={data.message}
                                onChange={(event) =>
                                    setData('message', event.target.value)
                                }
                                className="min-h-[180px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                required
                                maxLength={2000}
                            />
                            {errors.message && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.message}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Delivery channels
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)]">
                                    <input
                                        type="checkbox"
                                        checked={data.sms_enabled}
                                        onChange={(event) =>
                                            setData(
                                                'sms_enabled',
                                                event.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-[var(--border)]"
                                    />
                                    <MessageSquareText size={15} />
                                    SMS
                                </label>
                                <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)]">
                                    <input
                                        type="checkbox"
                                        checked={data.email_enabled}
                                        onChange={(event) =>
                                            setData(
                                                'email_enabled',
                                                event.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-[var(--border)]"
                                    />
                                    <Mail size={15} />
                                    Email
                                </label>
                            </div>
                            {formErrors.channels && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {formErrors.channels}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex min-h-[360px] flex-col rounded-lg border border-[var(--border)]">
                        <div className="border-b border-[var(--border)] p-3">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Audience
                            </label>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAudienceType('all_guardians')
                                    }
                                    className={`h-8 rounded-lg border text-xs font-semibold ${
                                        data.audience_type === 'all_guardians'
                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                                            : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAudienceType('selected_guardians')
                                    }
                                    className={`h-8 rounded-lg border text-xs font-semibold ${
                                        data.audience_type ===
                                        'selected_guardians'
                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                                            : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
                                    }`}
                                >
                                    Selected
                                </button>
                            </div>
                            {errors.audience_type && (
                                <span className="mt-1 block text-[11px] font-medium text-red-500">
                                    {errors.audience_type}
                                </span>
                            )}
                        </div>

                        {data.audience_type === 'selected_guardians' && (
                            <>
                                <div className="border-b border-[var(--border)] p-3">
                                    <input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search guardians..."
                                        className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                    />
                                </div>
                                <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                                    {filteredGuardians.map((guardian) => (
                                        <label
                                            key={guardian.id}
                                            className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-2 hover:bg-[var(--secondary)]"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.guardian_ids.includes(
                                                    guardian.id,
                                                )}
                                                onChange={() =>
                                                    toggleGuardian(guardian.id)
                                                }
                                                className="mt-1 h-4 w-4 rounded border-[var(--border)]"
                                            />
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-medium text-[var(--foreground)]">
                                                    {guardian.name}
                                                </span>
                                                <span className="block truncate text-xs text-[var(--muted-foreground)]">
                                                    {guardian.email}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.guardian_ids && (
                                    <span className="border-t border-[var(--border)] p-3 text-[11px] font-medium text-red-500">
                                        {errors.guardian_ids}
                                    </span>
                                )}
                            </>
                        )}

                        {data.audience_type === 'all_guardians' && (
                            <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-[var(--muted-foreground)]">
                                This announcement will be sent to all guardian
                                accounts.
                            </div>
                        )}
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
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        <Send size={14} />
                        {processing ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
}
