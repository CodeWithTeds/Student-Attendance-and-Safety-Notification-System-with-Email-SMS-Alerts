import { useForm } from '@inertiajs/react';
import { Save, UserRoundPlus, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { Adviser, AdviserForm } from '../types';

interface Props {
    isOpen: boolean;
    adviser: Adviser | null;
    onClose: () => void;
}

const initialForm: AdviserForm = {
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
};

export default function AdviserModal({ isOpen, adviser, onClose }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<AdviserForm>(initialForm);

    useEffect(() => {
        if (adviser && isOpen) {
            setData({
                first_name: adviser.first_name,
                middle_name: adviser.middle_name ?? '',
                last_name: adviser.last_name,
                email: adviser.email ?? '',
                phone: adviser.phone ?? '',
            });
        }
    }, [adviser, isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: handleClose };

        if (adviser) {
            put(`/admin/advisers/${adviser.id}`, options);
            return;
        }

        post('/admin/advisers', options);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <form
                className="flex w-full max-w-[760px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                    <div>
                        <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]">
                            <UserRoundPlus className="text-[var(--primary)]" size={22} />
                            {adviser ? 'Edit Adviser' : 'Add Adviser'}
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">Create an adviser profile that can be assigned to a section.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
                        aria-label="Close adviser modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">First name</label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            value={data.first_name}
                            onChange={(event) => setData('first_name', event.target.value)}
                            required
                        />
                        {errors.first_name && <span className="text-[11px] font-medium text-red-500">{errors.first_name}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Middle name</label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            value={data.middle_name}
                            onChange={(event) => setData('middle_name', event.target.value)}
                        />
                        {errors.middle_name && <span className="text-[11px] font-medium text-red-500">{errors.middle_name}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Last name</label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            value={data.last_name}
                            onChange={(event) => setData('last_name', event.target.value)}
                            required
                        />
                        {errors.last_name && <span className="text-[11px] font-medium text-red-500">{errors.last_name}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Phone</label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            value={data.phone}
                            onChange={(event) => {
                                const val = event.target.value.replace(/\D/g, '');
                                if (val.length <= 11) setData('phone', val);
                            }}
                            placeholder="09XXXXXXXXX"
                            maxLength={11}
                            inputMode="numeric"
                        />
                        {errors.phone && <span className="text-[11px] font-medium text-red-500">{errors.phone}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Email</label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            type="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder="adviser@example.com"
                        />
                        {errors.email && <span className="text-[11px] font-medium text-red-500">{errors.email}</span>}
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
                        {processing ? 'Saving...' : 'Save Adviser'}
                    </button>
                </div>
            </form>
        </div>
    );
}
