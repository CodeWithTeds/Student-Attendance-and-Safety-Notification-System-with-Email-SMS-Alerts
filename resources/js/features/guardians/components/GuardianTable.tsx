import { router } from '@inertiajs/react';
import { HeartPulse, Mail, MessageSquareText, Pencil, Trash2, UsersRound } from 'lucide-react';
import { Guardian } from '../types';

interface Props {
    guardians: Guardian[];
    selected: number[];
    onToggleAll: () => void;
    onToggleOne: (id: number) => void;
    onEdit: (guardian: Guardian) => void;
    meta: { from: number };
}

export default function GuardianTable({ guardians, selected, onToggleAll, onToggleOne, onEdit, meta }: Props) {
    const allSelected = guardians.length > 0 && guardians.every((guardian) => selected.includes(guardian.id));

    const handleDelete = (id: number) => {
        if (confirm('Delete this guardian?')) {
            router.delete(`/admin/parents/${id}`, { preserveScroll: true });
        }
    };

    const handleNotify = (id: number) => {
        router.post(`/admin/parents/${id}/notify`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Flash messages handled by server
            }
        });
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });

    return (
        <div className="flex-1 overflow-auto bg-[var(--background)] px-4">
            <table className="w-full min-w-[1060px] border-collapse text-[13px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-1 py-3 text-left">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                checked={allSelected}
                                onChange={onToggleAll}
                            />
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">#</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Guardian</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Email</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">SMS Contact</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Students</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Notifications</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Created</th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-2 py-3 text-right text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {guardians.length === 0 ? (
                        <tr>
                            <td colSpan={9}>
                                <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                                    <HeartPulse size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-medium">No guardians found.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        guardians.map((guardian, index) => {
                            const isSelected = selected.includes(guardian.id);
                            const initials = guardian.name
                                .split(' ')
                                .map((word) => word[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase();
                            const avatarColors = ['bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500', 'bg-blue-500', 'bg-violet-500'];
                            const avatarColor = avatarColors[guardian.id % avatarColors.length];
                            const children = guardian.children ?? [];

                            return (
                                <tr
                                    key={guardian.id}
                                    className={`transition-colors hover:bg-[var(--accent)]/30 ${isSelected ? 'bg-[var(--accent)]/50' : ''}`}
                                >
                                    <td className="px-1 py-2.5">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                            checked={isSelected}
                                            onChange={() => onToggleOne(guardian.id)}
                                        />
                                    </td>
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">{(meta.from ?? 0) + index}</td>
                                    <td className="px-2 py-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ${avatarColor}`}>
                                                {initials}
                                            </div>
                                            <span className="font-medium text-[var(--foreground)]">{guardian.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">{guardian.email}</td>
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">{guardian.guardian_phone || 'Not set'}</td>
                                    <td className="px-2 py-2.5">
                                        {children.length > 0 ? (
                                            <div className="flex max-w-[240px] flex-wrap gap-1.5">
                                                {children.slice(0, 2).map((student) => (
                                                    <span
                                                        key={student.id}
                                                        className="inline-flex items-center gap-1 rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--secondary-foreground)]"
                                                    >
                                                        <UsersRound size={11} />
                                                        {student.name}
                                                    </span>
                                                ))}
                                                {children.length > 2 && (
                                                    <span className="inline-flex items-center rounded-full bg-[var(--muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
                                                        +{children.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-[11px] text-[var(--muted-foreground)]">No students linked</span>
                                        )}
                                    </td>
                                    <td className="px-2 py-2.5">
                                        <div className="flex flex-wrap gap-1.5">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                    guardian.notification_sms_enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                <MessageSquareText size={11} />
                                                SMS
                                            </span>
                                            <button
                                                onClick={() => guardian.notification_email_enabled && handleNotify(guardian.id)}
                                                disabled={!guardian.notification_email_enabled}
                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all ${
                                                    guardian.notification_email_enabled 
                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:scale-95 cursor-pointer' 
                                                        : 'bg-slate-100 text-slate-500 cursor-not-allowed opacity-60'
                                                }`}
                                                title={guardian.notification_email_enabled ? "Click to send attendance email" : "Email notifications disabled"}
                                            >
                                                <Mail size={11} />
                                                Email
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">{formatDate(guardian.created_at)}</td>
                                    <td className="px-2 py-2.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary)]"
                                                onClick={() => onEdit(guardian)}
                                                title="Edit guardian"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-600"
                                                onClick={() => handleDelete(guardian.id)}
                                                title="Delete guardian"
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
