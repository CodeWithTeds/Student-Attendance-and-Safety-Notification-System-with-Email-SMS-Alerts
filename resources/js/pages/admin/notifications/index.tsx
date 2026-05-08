import { Head } from '@inertiajs/react';
import NotificationSettingCard from '@/features/notifications/components/NotificationSettingCard';
import type { NotificationSetting } from '@/features/notifications/types';

interface ResourceCollection<T> {
    data: T[];
}

interface Props {
    notificationSettings: ResourceCollection<NotificationSetting>;
}

export default function NotificationsIndex({ notificationSettings }: Props) {
    const settings = notificationSettings?.data ?? [];

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Notification Management" />

            <div className="border-b border-[var(--border)] p-5">
                <h1 className="text-xl font-bold text-[var(--foreground)]">
                    Notification Management
                </h1>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Configure SMS and email alerts for attendance, absence, late
                    arrivals, and announcements.
                </p>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-auto p-4">
                {settings.map((setting) => (
                    <NotificationSettingCard
                        key={setting.id}
                        setting={setting}
                    />
                ))}
            </div>
        </div>
    );
}

NotificationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Notification Management', href: '/admin/notifications' },
    ],
};
