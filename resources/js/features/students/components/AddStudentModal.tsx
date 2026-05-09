import { useForm } from '@inertiajs/react';
import { GraduationCap, Plus, X } from 'lucide-react';
import { FormEvent } from 'react';
import { AddStudentForm, Section } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    sections: Section[];
}

const initialForm: AddStudentForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    section_ids: [],
};

export default function AddStudentModal({ isOpen, onClose, sections }: Props) {
    const {
        data: studentForm,
        setData: setStudentForm,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<AddStudentForm>(initialForm);

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/students', {
            preserveScroll: true,
            onSuccess: handleClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <form 
                className="flex w-full max-w-[980px] max-h-[86vh] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl" 
                onSubmit={handleSubmit}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                    <div>
                        <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]">
                            <GraduationCap className="text-[var(--primary)]" size={22} />
                            Add Student
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            Create a pending student account. A unique QR code will be generated after approval.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-colors"
                        aria-label="Close add student modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Display name</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                value={studentForm.name}
                                onChange={(e) => setStudentForm('name', e.target.value)}
                                placeholder="Juan Dela Cruz"
                                required
                            />
                            {errors.name && <span className="text-[11px] text-red-500 font-medium">{errors.name}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">First name</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                value={studentForm.first_name}
                                onChange={(e) => setStudentForm('first_name', e.target.value)}
                                placeholder="Juan"
                                required
                            />
                            {errors.first_name && <span className="text-[11px] text-red-500 font-medium">{errors.first_name}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Middle name</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                value={studentForm.middle_name}
                                onChange={(e) => setStudentForm('middle_name', e.target.value)}
                                placeholder="Santos"
                            />
                            {errors.middle_name && <span className="text-[11px] text-red-500 font-medium">{errors.middle_name}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Last name</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                value={studentForm.last_name}
                                onChange={(e) => setStudentForm('last_name', e.target.value)}
                                placeholder="Dela Cruz"
                                required
                            />
                            {errors.last_name && <span className="text-[11px] text-red-500 font-medium">{errors.last_name}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Section</label>
                            <select
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                value={studentForm.section_ids[0] || ''}
                                onChange={(e) => setStudentForm('section_ids', e.target.value ? [parseInt(e.target.value)] : [])}
                            >
                                <option value="">No Section</option>
                                {sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.grade_level?.name} - {section.name}
                                    </option>
                                ))}
                            </select>
                            {errors.section_ids && <span className="text-[11px] text-red-500 font-medium">{errors.section_ids}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Email</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                type="email"
                                value={studentForm.email}
                                onChange={(e) => setStudentForm('email', e.target.value)}
                                placeholder="student@example.com"
                                required
                            />
                            {errors.email && <span className="text-[11px] text-red-500 font-medium">{errors.email}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Password</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                type="password"
                                value={studentForm.password}
                                onChange={(e) => setStudentForm('password', e.target.value)}
                                placeholder="At least 8 characters"
                                required
                            />
                            {errors.password && <span className="text-[11px] text-red-500 font-medium">{errors.password}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Confirm password</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                type="password"
                                value={studentForm.password_confirmation}
                                onChange={(e) => setStudentForm('password_confirmation', e.target.value)}
                                placeholder="Repeat password"
                                required
                            />
                            {errors.password_confirmation && (
                                <span className="text-[11px] text-red-500 font-medium">{errors.password_confirmation}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] p-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-colors disabled:opacity-50 shadow-sm"
                    >
                        <Plus size={14} />
                        {processing ? 'Saving...' : 'Add Student'}
                    </button>
                </div>
            </form>
        </div>
    );
}
