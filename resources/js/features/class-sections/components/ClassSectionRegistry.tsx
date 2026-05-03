import { router } from '@inertiajs/react';
import { GraduationCap, Pencil, Trash2, UserRound } from 'lucide-react';
import { Adviser, GradeLevel } from '../types';

interface Props {
    gradeLevels: GradeLevel[];
    advisers: Adviser[];
    onEditGradeLevel: (gradeLevel: GradeLevel) => void;
    onEditAdviser: (adviser: Adviser) => void;
}

export default function ClassSectionRegistry({ gradeLevels, advisers, onEditGradeLevel, onEditAdviser }: Props) {
    const handleDeleteGradeLevel = (gradeLevel: GradeLevel) => {
        if (confirm(`Delete ${gradeLevel.name}? Sections under it will also be deleted.`)) {
            router.delete(`/admin/grade-levels/${gradeLevel.id}`, { preserveScroll: true });
        }
    };

    const handleDeleteAdviser = (adviser: Adviser) => {
        if (confirm(`Delete adviser ${adviser.full_name}?`)) {
            router.delete(`/admin/advisers/${adviser.id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="grid gap-4 border-t border-[var(--border)] bg-[var(--background)] p-4 lg:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                    <GraduationCap size={16} className="text-[var(--primary)]" />
                    <h2 className="text-sm font-semibold text-[var(--foreground)]">Grade Levels</h2>
                </div>
                <div className="max-h-[260px] overflow-auto">
                    {gradeLevels.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">No grade levels yet.</p>
                    ) : (
                        gradeLevels.map((gradeLevel) => (
                            <div key={gradeLevel.id} className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 last:border-b-0">
                                <div>
                                    <div className="text-sm font-medium text-[var(--foreground)]">{gradeLevel.name}</div>
                                    <div className="text-[11px] text-[var(--muted-foreground)]">
                                        {gradeLevel.code} | {gradeLevel.sections_count} sections
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary)]"
                                        onClick={() => onEditGradeLevel(gradeLevel)}
                                        title="Edit grade level"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-600"
                                        onClick={() => handleDeleteGradeLevel(gradeLevel)}
                                        title="Delete grade level"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                    <UserRound size={16} className="text-[var(--primary)]" />
                    <h2 className="text-sm font-semibold text-[var(--foreground)]">Advisers</h2>
                </div>
                <div className="max-h-[260px] overflow-auto">
                    {advisers.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">No advisers yet.</p>
                    ) : (
                        advisers.map((adviser) => (
                            <div key={adviser.id} className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 last:border-b-0">
                                <div>
                                    <div className="text-sm font-medium text-[var(--foreground)]">{adviser.full_name}</div>
                                    <div className="text-[11px] text-[var(--muted-foreground)]">
                                        {adviser.email ?? adviser.phone ?? 'No contact'} | {adviser.sections_count} sections
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary)]"
                                        onClick={() => onEditAdviser(adviser)}
                                        title="Edit adviser"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-600"
                                        onClick={() => handleDeleteAdviser(adviser)}
                                        title="Delete adviser"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
