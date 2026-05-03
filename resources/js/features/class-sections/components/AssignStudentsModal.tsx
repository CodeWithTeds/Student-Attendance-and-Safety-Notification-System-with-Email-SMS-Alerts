import { useForm } from '@inertiajs/react';
import { Check, Search, UserPlus, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AssignStudentsForm, Section, Student } from '../types';

interface Props {
    isOpen: boolean;
    section: Section | null;
    students: Student[];
    onClose: () => void;
}

export default function AssignStudentsModal({ isOpen, section, students, onClose }: Props) {
    const [search, setSearch] = useState('');
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<AssignStudentsForm>({
        student_ids: [],
    });

    useEffect(() => {
        if (section && isOpen) {
            setData('student_ids', section.students?.map((student) => student.id) ?? []);
        }
    }, [section, isOpen]);

    const filteredStudents = useMemo(() => {
        const searchValue = search.toLowerCase();

        return students.filter((student) => {
            return (
                student.name.toLowerCase().includes(searchValue) ||
                student.email.toLowerCase().includes(searchValue) ||
                (student.student_number ?? '').toLowerCase().includes(searchValue)
            );
        });
    }, [search, students]);

    if (!isOpen || !section) return null;

    const handleClose = () => {
        onClose();
        setSearch('');
        reset();
        clearErrors();
    };

    const toggleStudent = (studentId: number) => {
        setData(
            'student_ids',
            data.student_ids.includes(studentId)
                ? data.student_ids.filter((id) => id !== studentId)
                : [...data.student_ids, studentId],
        );
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/admin/sections/${section.id}/students`, {
            preserveScroll: true,
            onSuccess: handleClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <form
                className="flex max-h-[86vh] w-full max-w-[920px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                    <div>
                        <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]">
                            <UserPlus className="text-[var(--primary)]" size={22} />
                            Assign Students
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            {section.grade_level?.name ?? 'Grade level'} - {section.name} | {section.school_year}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
                        aria-label="Close assign students modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="border-b border-[var(--border)] p-4">
                    <div className="relative max-w-[360px]">
                        <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]" />
                        <input
                            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-[13px] text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                            placeholder="Search students..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                    {errors.student_ids && <span className="mt-2 block text-[11px] font-medium text-red-500">{errors.student_ids}</span>}
                </div>

                <div className="flex-1 overflow-auto px-4">
                    <table className="w-full min-w-[780px] border-collapse text-[13px]">
                        <thead>
                            <tr className="border-b-2 border-[var(--border)]">
                                <th className="sticky top-0 z-10 bg-[var(--background)] px-1 py-3 text-left" />
                                <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Student</th>
                                <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Student No.</th>
                                <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Current Section</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filteredStudents.map((student) => {
                                const isSelected = data.student_ids.includes(student.id);
                                const currentSection = student.current_section;

                                return (
                                    <tr
                                        key={student.id}
                                        className={`transition-colors hover:bg-[var(--accent)]/30 ${isSelected ? 'bg-[var(--accent)]/50' : ''}`}
                                    >
                                        <td className="px-1 py-2.5">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                                checked={isSelected}
                                                onChange={() => toggleStudent(student.id)}
                                            />
                                        </td>
                                        <td className="px-2 py-2.5">
                                            <div className="font-medium text-[var(--foreground)]">{student.name}</div>
                                            <div className="text-[11px] text-[var(--muted-foreground)]">{student.email}</div>
                                        </td>
                                        <td className="px-2 py-2.5 font-mono text-xs text-[var(--muted-foreground)]">{student.student_number ?? 'Pending'}</td>
                                        <td className="px-2 py-2.5 text-[var(--muted-foreground)]">
                                            {currentSection ? `${currentSection.grade_level?.name ?? ''} ${currentSection.name}` : 'Unassigned'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] p-4">
                    <span className="text-xs font-medium text-[var(--muted-foreground)]">{data.student_ids.length} selected</span>
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
                            <Check size={14} />
                            {processing ? 'Assigning...' : 'Assign Students'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
