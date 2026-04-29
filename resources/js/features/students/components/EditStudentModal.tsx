import { useForm } from '@inertiajs/react';
import { GraduationCap, Save, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { EditStudentForm, User } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    student: User | null;
}

export default function EditStudentModal({ isOpen, onClose, student }: Props) {
    const {
        data: form,
        setData: setForm,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<EditStudentForm>({
        name: '',
        email: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        student_number: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (student && isOpen) {
            setForm({
                name: student.name || '',
                email: student.email || '',
                first_name: student.first_name || '',
                middle_name: student.middle_name || '',
                last_name: student.last_name || '',
                student_number: student.student_number || '',
                password: '',
                password_confirmation: '',
            });
        }
    }, [student, isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!student) return;

        put(`/admin/users/${student.id}`, {
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
                            Edit Student
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            Update student information. Leave password fields blank to keep the current password.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-colors"
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
                                value={form.name}
                                onChange={(e) => setForm('name', e.target.value)}
                                placeholder="Juan Dela Cruz"
                                required
                            />
                            {errors.name && <span className="text-[11px] text-red-500 font-medium">{errors.name}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">First name</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                value={form.first_name}
                                onChange={(e) => setForm('first_name', e.target.value)}
                                required
                            />
                            {errors.first_name && <span className="text-[11px] text-red-500 font-medium">{errors.first_name}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Middle name</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                value={form.middle_name}
                                onChange={(e) => setForm('middle_name', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Last name</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                value={form.last_name}
                                onChange={(e) => setForm('last_name', e.target.value)}
                                required
                            />
                            {errors.last_name && <span className="text-[11px] text-red-500 font-medium">{errors.last_name}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Student Number</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                value={form.student_number}
                                onChange={(e) => setForm('student_number', e.target.value)}
                            />
                            {errors.student_number && <span className="text-[11px] text-red-500 font-medium">{errors.student_number}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Email</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm('email', e.target.value)}
                                required
                            />
                            {errors.email && <span className="text-[11px] text-red-500 font-medium">{errors.email}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">New Password</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm('password', e.target.value)}
                                placeholder="Optional"
                            />
                            {errors.password && <span className="text-[11px] text-red-500 font-medium">{errors.password}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">Confirm Password</label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                                type="password"
                                value={form.password_confirmation}
                                onChange={(e) => setForm('password_confirmation', e.target.value)}
                                placeholder="Optional"
                            />
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
                        <Save size={14} />
                        {processing ? 'Saving...' : 'Update Student'}
                    </button>
                </div>
            </form>
        </div>
    );
}
