import { router } from '@inertiajs/react';
import { Check, GraduationCap, Pencil, QrCode, Trash2 } from 'lucide-react';
import { User } from '../types';

interface Props {
    students: User[];
    selected: number[];
    onToggleAll: () => void;
    onToggleOne: (id: number) => void;
    onViewQr: (student: User) => void;
    onEdit: (student: User) => void;
    onApprove: (id: number) => void;
    meta: { from: number };
}

export default function StudentTable({
    students,
    selected,
    onToggleAll,
    onToggleOne,
    onViewQr,
    onEdit,
    onApprove,
    meta,
}: Props) {
    const allSelected = students.length > 0 && students.every((s) => selected.includes(s.id));

    const handleDelete = (id: number) => {
        if (confirm('Delete this student?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });

    return (
        <div className="flex-1 overflow-auto px-4 bg-[var(--background)]">
            <table className="w-full border-collapse text-[13px] min-w-[960px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <th className="sticky top-0 z-10 bg-[var(--background)] py-3 px-1 text-left">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                checked={allSelected}
                                onChange={onToggleAll}
                            />
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] py-3 px-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">#</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] py-3 px-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Name</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] py-3 px-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Email</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] py-3 px-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Student No.</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] py-3 px-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Status</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] py-3 px-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">QR Code</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] py-3 px-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Created</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] py-3 px-2 text-right text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan={10}>
                                <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                                    <GraduationCap size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-medium">No students found.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        students.map((student, i) => {
                            const isSelected = selected.includes(student.id);
                            const isApproved = student.status === 'approved';
                            const initials = student.name
                                .split(' ')
                                .map((w) => w[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase();
                            
                            const avatarColors = [
                                'bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 
                                'bg-amber-500', 'bg-blue-500', 'bg-violet-500'
                            ];
                            const avatarColor = avatarColors[student.id % avatarColors.length];

                            return (
                                <tr 
                                    key={student.id} 
                                    className={`transition-colors hover:bg-[var(--accent)]/30 ${isSelected ? 'bg-[var(--accent)]/50' : ''}`}
                                >
                                    <td className="py-2.5 px-1">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                            checked={isSelected}
                                            onChange={() => onToggleOne(student.id)}
                                        />
                                    </td>
                                    <td className="py-2.5 px-2 text-[var(--muted-foreground)]">{(meta.from ?? 0) + i}</td>
                                    <td className="py-2.5 px-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ${avatarColor}`}>
                                                {initials}
                                            </div>
                                            <span className="font-medium text-[var(--foreground)]">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-2 text-[var(--muted-foreground)]">{student.email}</td>
                                    <td className="py-2.5 px-2 font-mono text-xs text-[var(--muted-foreground)]">
                                        {student.student_number ?? 'Pending'}
                                    </td>
                                    <td className="py-2.5 px-2">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                            isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="py-2.5 px-2">
                                        {student.qr_code_svg ? (
                                            <button
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors shadow-sm"
                                                onClick={() => onViewQr(student)}
                                                title="View Student QR ID"
                                            >
                                                <QrCode size={14} className="text-[var(--primary)]" />
                                                View QR
                                            </button>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
                                                <QrCode size={12} /> Not generated
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2.5 px-2 text-[var(--muted-foreground)]">{formatDate(student.created_at)}</td>
                                    <td className="py-2.5 px-2">
                                        <div className="flex items-center justify-end gap-1">
                                            {!isApproved && (
                                                <button
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                                                    onClick={() => onApprove(student.id)}
                                                    title="Approve student"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            <button
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary)]"
                                                onClick={() => onEdit(student)}
                                                title="Edit student"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-600"
                                                onClick={() => handleDelete(student.id)}
                                                title="Delete student"
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
