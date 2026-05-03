import { useForm } from '@inertiajs/react';
import { Layers3, Save, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { Adviser, GradeLevel, Section, SectionForm } from '../types';

interface Props {
    isOpen: boolean;
    section: Section | null;
    gradeLevels: GradeLevel[];
    advisers: Adviser[];
    onClose: () => void;
}

const currentSchoolYear = () => {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
};

const initialForm: SectionForm = {
    grade_level_id: '',
    adviser_id: '',
    name: '',
    school_year: currentSchoolYear(),
    capacity: '',
};

export default function SectionModal({ isOpen, section, gradeLevels, advisers, onClose }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<SectionForm>(initialForm);

    useEffect(() => {
        if (section && isOpen) {
            setData({
                grade_level_id: section.grade_level ? String(section.grade_level.id) : '',
                adviser_id: section.adviser ? String(section.adviser.id) : '',
                name: section.name,
                school_year: section.school_year,
                capacity: section.capacity ? String(section.capacity) : '',
            });
        }
    }, [section, isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: handleClose };

        if (section) {
            put(`/admin/sections/${section.id}`, options);
            return;
        }

        post('/admin/sections', options);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <form
                className="flex max-h-[86vh] w-full max-w-[820px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                    <div>
                        <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]">
                            <Layers3 className="text-[var(--primary)]" size={22} />
                            {section ? 'Edit Section' : 'Add Section'}
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">Create a class section, connect it to a grade level, and assign an adviser.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
                        aria-label="Close section modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 overflow-y-auto p-6 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Grade level</label>
                        <select
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            value={data.grade_level_id}
                            onChange={(event) => setData('grade_level_id', event.target.value)}
                            required
                        >
                            <option value="">Select grade level</option>
                            {gradeLevels.map((gradeLevel) => (
                                <option key={gradeLevel.id} value={gradeLevel.id}>
                                    {gradeLevel.name}
                                </option>
                            ))}
                        </select>
                        {errors.grade_level_id && <span className="text-[11px] font-medium text-red-500">{errors.grade_level_id}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Adviser</label>
                        <select
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            value={data.adviser_id}
                            onChange={(event) => setData('adviser_id', event.target.value)}
                        >
                            <option value="">No adviser yet</option>
                            {advisers.map((adviser) => (
                                <option key={adviser.id} value={adviser.id}>
                                    {adviser.full_name}
                                </option>
                            ))}
                        </select>
                        {errors.adviser_id && <span className="text-[11px] font-medium text-red-500">{errors.adviser_id}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Section name</label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            placeholder="St. Matthew"
                            required
                        />
                        {errors.name && <span className="text-[11px] font-medium text-red-500">{errors.name}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">School year</label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            value={data.school_year}
                            onChange={(event) => setData('school_year', event.target.value)}
                            placeholder="2026-2027"
                            required
                        />
                        {errors.school_year && <span className="text-[11px] font-medium text-red-500">{errors.school_year}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Capacity</label>
                        <input
                            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            type="number"
                            min="1"
                            max="500"
                            value={data.capacity}
                            onChange={(event) => setData('capacity', event.target.value)}
                            placeholder="Optional"
                        />
                        {errors.capacity && <span className="text-[11px] font-medium text-red-500">{errors.capacity}</span>}
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
                        {processing ? 'Saving...' : 'Save Section'}
                    </button>
                </div>
            </form>
        </div>
    );
}
