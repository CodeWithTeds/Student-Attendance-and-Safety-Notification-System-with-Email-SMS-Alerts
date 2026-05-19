import type { AttendanceMeta } from '@/features/attendance/types';
import type { NotificationHistory } from '@/features/parent-portal/types';
import { Bell, Megaphone } from 'lucide-react';

interface Props {
    notifications: NotificationHistory[];
    meta: AttendanceMeta;
    scrollClassName?: string;
}

const statusClass = (status?: string | null) => {
    if (status === 'sent') return 'bg-emerald-100 text-emerald-700';
    if (status === 'failed') return 'bg-rose-100 text-rose-700';
    if (status === 'skipped') return 'bg-orange-100 text-orange-700';

    return 'bg-slate-100 text-slate-500';
};

export default function AnnouncementNotificationTable({ notifications, meta, scrollClassName = 'max-h-52' }: Props) {
    return (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Announcement delivery history</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                        {meta.total > 0 ? `${meta.from}-${meta.to} of ${meta.total} notices` : 'No announcement notices yet'}
                    </p>
                </div>
                <Bell size={16} className="text-[var(--muted-foreground)]" />
            </div>

            <div className={`${scrollClassName} overflow-auto`}>
                <table className="w-full min-w-[760px] border-collapse text-[13px]">
                    <thead>
                        <tr className="border-b border-[var(--border)]">
                            <th className="sticky top-0 bg-[var(--background)] px-2 py-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Notice</th>
                            <th className="sticky top-0 bg-[var(--background)] px-2 py-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">SMS</th>
                            <th className="sticky top-0 bg-[var(--background)] px-2 py-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Email</th>
                            <th className="sticky top-0 bg-[var(--background)] px-2 py-2 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Updated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {notifications.length === 0 ? (
                            <tr>
                                <td colSpan={4}>
                                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--muted-foreground)]">
                                        <Megaphone size={18} className="opacity-40" />
                                        No notification history found.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            notifications.map((notification) => (
                                <tr key={notification.id} className="hover:bg-[var(--accent)]/30">
                                    <td className="px-2 py-2.5">
                                        <p className="font-medium text-[var(--foreground)]">{notification.announcement.title ?? 'Untitled announcement'}</p>
                                        <p className="max-w-xl truncate text-[11px] text-[var(--muted-foreground)]">{notification.announcement.message ?? 'No message'}</p>
                                    </td>
                                    <td className="px-2 py-2.5">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClass(notification.sms_status)}`}>
                                            {notification.sms_status ?? 'none'}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2.5">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClass(notification.email_status)}`}>
                                            {notification.email_status ?? 'none'}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2.5 text-[var(--muted-foreground)]">{notification.updated_at_display ?? 'Not updated'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
