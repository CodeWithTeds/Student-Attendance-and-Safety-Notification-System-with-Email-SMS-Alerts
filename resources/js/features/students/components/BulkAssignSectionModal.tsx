import { useForm } from '@inertiajs/react';
import { Layers, X } from 'lucide-react';
import { FormEvent, useMemo, useEffect } from 'react';
import { Section, User } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedStudents: User[];
    sections: Section[];
}

export default function BulkAssignSectionModal({ isOpen, onClose, selectedStudents, sections }: Props) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        student_ids: [] as number[],
        section_id: '',
    });

    // Sync student_ids when selectedStudents changes
    useEffect(() => {
        if (isOpen) {
            setData('student_ids', selectedStudents.map((s) => s.id));
        }
    }, [selectedStudents, isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/students/bulk-assign-section', {
            preserveScroll: true,
            onSuccess: handleClose,
        });
    };

    // Group sections by grade level
    const sectionsByGrade = useMemo(() => {
        const grouped: Record<number, { name: string; sections: Section[] }> = {};
        sections.forEach((s) => {
            const gradeLevel = s.grade_level;
            if (gradeLevel) {
                if (!grouped[gradeLevel.id]) {
                    grouped[gradeLevel.id] = { name: gradeLevel.name, sections: [] };
                }
                grouped[gradeLevel.id].sections.push(s);
            }
        });
        return grouped;
    }, [sections]);

    // Identify grade levels of selected students
    const selectedGradeLevelIds = useMemo(() => {
        const ids = new Set(selectedStudents.map((s) => s.grade_level?.id).filter(Boolean) as number[]);
        return Array.from(ids);
    }, [selectedStudents]);

    // Filtered sections: only show sections that match the grade levels of selected students
    // OR if students have different grade levels, show all but with a warning.
    const filteredSectionsByGrade = useMemo(() => {
        if (selectedGradeLevelIds.length === 1) {
            const gid = selectedGradeLevelIds[0];
            return sectionsByGrade[gid] ? { [gid]: sectionsByGrade[gid] } : sectionsByGrade;
        }
        return sectionsByGrade;
    }, [sectionsByGrade, selectedGradeLevelIds]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm animate-in fade-in duration-200">
            <form 
                className="flex w-full max-w-[500px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl animate-in zoom-in-95 duration-200" 
                onSubmit={handleSubmit}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                    <div>
                        <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                                <Layers size={18} />
                            </div>
                            Auto-Assign Sections
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            Assign {selectedStudents.length} students to their respective grade level sections.
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

                {/* Body */}
                <div className="p-6 space-y-5">
                    <div className="rounded-lg bg-blue-50 p-3 text-[11px] text-blue-800 border border-blue-200">
                        <p className="font-semibold mb-1 flex items-center gap-1.5">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-200 text-blue-900 font-bold">i</span>
                            Automatic Assignment
                        </p>
                        Students will be automatically assigned to the first available section matching their registered grade level.
                    </div>

                    <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-4">
                        <p className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Selected Students</p>
                        <div className="max-h-[200px] overflow-y-auto space-y-1 pr-2">
                            {selectedStudents.map(student => (
                                <div key={student.id} className="flex items-center justify-between py-1 border-b border-[var(--border)] last:border-0">
                                    <span className="text-xs font-medium text-[var(--foreground)]">{student.name}</span>
                                    <span className="text-[10px] bg-[var(--background)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--muted-foreground)]">
                                        {student.grade_level?.name || 'No Grade Level'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] p-4 bg-[var(--muted)]/10">
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
                        {processing ? (
                            <>
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--primary-foreground)] border-t-transparent" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Layers size={14} />
                                Confirm Assignment
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
