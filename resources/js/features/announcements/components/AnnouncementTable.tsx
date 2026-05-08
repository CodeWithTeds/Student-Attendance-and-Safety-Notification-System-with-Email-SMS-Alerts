import { Mail, Megaphone, MessageSquareText } from 'lucide-react';
import type { Announcement, AnnouncementMeta } from '../types';

interface Props {
    announcements: Announcement[];
    meta: AnnouncementMeta;
}

export default function AnnouncementTable({ announcements, meta }: Props) {
    return (
        <div className="min-h-0 flex-1 overflow-auto bg-[var(--background)] px-4">
            <table className="w-full min-w-[1080px] border-collapse text-[13px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            #
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Announcement
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Channels
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Recipients
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Status
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Sent
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {announcements.length === 0 ? (
                        <tr>
                            <td colSpan={6}>
                                <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                                    <Megaphone
                                        size={44}
                                        className="mb-4 opacity-20"
                                    />
                                    <p className="text-sm font-medium">
                                        No announcements sent yet.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        announcements.map((announcement, index) => (
                            <tr
                                key={announcement.id}
                                className="transition-colors hover:bg-[var(--accent)]/30"
                            >
                                <td className="px-3 py-3 text-[var(--muted-foreground)]">
                                    {(meta.from ?? 0) + index}
                                </td>
                                <td className="max-w-[420px] px-3 py-3">
                                    <div className="font-semibold text-[var(--foreground)]">
                                        {announcement.title}
                                    </div>
                                    <div className="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)]">
                                        {announcement.message}
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    <div className="flex flex-wrap gap-1.5">
                                        {announcement.sms_enabled && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                                                <MessageSquareText size={12} />
                                                SMS
                                            </span>
                                        )}
                                        {announcement.email_enabled && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                <Mail size={12} />
                                                Email
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--foreground)]">
                                    <div>
                                        {announcement.recipients_count} total
                                    </div>
                                    <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                                        {announcement.sms_sent_count} SMS ·{' '}
                                        {announcement.email_sent_count} email
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            announcement.status === 'sent'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : announcement.status ===
                                                    'partial'
                                                  ? 'bg-amber-100 text-amber-700'
                                                  : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {announcement.status_label}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-sm text-[var(--muted-foreground)]">
                                    {announcement.sent_at_display ?? '-'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
