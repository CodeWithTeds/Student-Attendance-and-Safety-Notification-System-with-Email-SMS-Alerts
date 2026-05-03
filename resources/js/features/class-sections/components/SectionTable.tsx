import { router } from '@inertiajs/react';
import { Layers3, Pencil, Trash2, UserMinus, UserPlus } from 'lucide-react';
import { Section } from '../types';

interface Props {
    sections: Section[];
    meta: { from: number };
    onEdit: (section: Section) => void;
    onAssign: (section: Section) => void;
}

export default function SectionTable({ sections, meta, onEdit, onAssign }: Props) {
    const handleDelete = (section: Section) => {
        if (confirm(`Delete ${section.grade_level?.name ?? 'this grade'} - ${section.name}?`)) {
            router.delete(`/admin/sections/${section.id}`, { preserveScroll: true });
        }
    };

    const handleUnassign = (sectionId: number, studentId: number) => {
        if (confirm('Remove this student from the section?')) {
            router.delete(`/admin/sections/${sectionId}/students/${studentId}`, { preserveScroll: true });
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-[var(--background)] px-4">
            <table className="w-full min-w-[1080px] border-collapse text-[13px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">#</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Section</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">School Year</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Adviser</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Students</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-right text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {sections.length === 0 ? (
                        <tr>
                            <td colSpan={6}>
                                <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                                    <Layers3 size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-medium">No sections found.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        sections.map((section, index) => {
                            const capacityLabel = section.capacity ? `${section.students_count}/${section.capacity}` : `${section.students_count}`;

                            return (
                                <tr key={section.id} className="transition-colors hover:bg-[var(--accent)]/30">
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">{(meta.from ?? 0) + index}</td>
                                    <td className="px-2 py-2.5">
                                        <div className="font-medium text-[var(--foreground)]">
                                            {section.grade_level?.name ?? 'No grade level'} - {section.name}
                                        </div>
                                        <div className="text-[11px] text-[var(--muted-foreground)]">{section.grade_level?.code ?? 'No code'}</div>
                                    </td>
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">{section.school_year}</td>
                                    <td className="px-2 py-2.5">
                                        {section.adviser ? (
                                            <>
                                                <div className="font-medium text-[var(--foreground)]">{section.adviser.full_name}</div>
                                                <div className="text-[11px] text-[var(--muted-foreground)]">{section.adviser.email ?? section.adviser.phone ?? 'No contact'}</div>
                                            </>
                                        ) : (
                                            <span className="text-[var(--muted-foreground)]">No adviser</span>
                                        )}
                                    </td>
                                    <td className="px-2 py-2.5">
                                        <div className="mb-2 inline-flex rounded-full bg-[var(--muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
                                            {capacityLabel} enrolled
                                        </div>
                                        <div className="flex max-w-[420px] flex-wrap gap-1.5">
                                            {(section.students ?? []).slice(0, 4).map((student) => (
                                                <span
                                                    key={student.id}
                                                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--foreground)]"
                                                >
                                                    {student.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUnassign(section.id, student.id)}
                                                        className="text-[var(--muted-foreground)] transition-colors hover:text-red-600"
                                                        title="Remove student"
                                                    >
                                                        <UserMinus size={11} />
                                                    </button>
                                                </span>
                                            ))}
                                            {(section.students?.length ?? 0) > 4 && (
                                                <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[11px] text-[var(--muted-foreground)]">
                                                    +{(section.students?.length ?? 0) - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                                                onClick={() => onAssign(section)}
                                                title="Assign students"
                                            >
                                                <UserPlus size={14} />
                                            </button>
                                            <button
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary)]"
                                                onClick={() => onEdit(section)}
                                                title="Edit section"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-600"
                                                onClick={() => handleDelete(section)}
                                                title="Delete section"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
