import { useForm } from '@inertiajs/react';
import { GraduationCap, Save, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { GradeLevel, GradeLevelForm } from '../types';

interface Props {
    isOpen: boolean;
    gradeLevel: GradeLevel | null;
    onClose: () => void;
}

const initialForm: GradeLevelForm = {
    name: '',
    code: '',
    sort_order: '0',
};

export default function GradeLevelModal({ isOpen, gradeLevel, onClose }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<GradeLevelForm>(initialForm);

    useEffect(() => {
        if (gradeLevel && isOpen) {
            setData({
                name: gradeLevel.name,
                code: gradeLevel.code,
                sort_order: String(gradeLevel.sort_order ?? 0),
            });
        }
    }, [gradeLevel, isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: handleClose };

        if (gradeLevel) {
            put(`/admin/grade-levels/${gradeLevel.id}`, options);
            return;
        }

        post('/admin/grade-levels', options);
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
                            <GraduationCap className="text-[var(--primary)]" size={22} />
                            {gradeLevel ? 'Edit Grade Level' : 'Add Grade Level'}
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">Set the level label, short code, and table order.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
                        aria-label="Close grade level modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="grid gap-5 p-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Name</label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            placeholder="Grade 7"
                            required
                        />
                        {errors.name && <span className="text-[11px] font-medium text-red-500">{errors.name}</span>}
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Code</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={data.code}
                                onChange={(event) => setData('code', event.target.value)}
                                placeholder="G7"
                                required
                            />
                            {errors.code && <span className="text-[11px] font-medium text-red-500">{errors.code}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Sort order</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                type="number"
                                min="0"
                                value={data.sort_order}
                                onChange={(event) => setData('sort_order', event.target.value)}
                            />
                            {errors.sort_order && <span className="text-[11px] font-medium text-red-500">{errors.sort_order}</span>}
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
                        {processing ? 'Saving...' : 'Save Grade Level'}
                    </button>
                </div>
            </form>
        </div>
    );
}
