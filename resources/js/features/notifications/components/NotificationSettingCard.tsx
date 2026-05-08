import { useForm } from '@inertiajs/react';
import { Bell, Mail, MessageSquareText, Save } from 'lucide-react';
import { useEffect } from 'react';
import type { FormEvent } from 'react';
import type { NotificationSetting, NotificationSettingForm } from '../types';

interface Props {
    setting: NotificationSetting;
}

export default function NotificationSettingCard({ setting }: Props) {
    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm<NotificationSettingForm>({
            sms_enabled: setting.sms_enabled,
            email_enabled: setting.email_enabled,
            title: setting.title,
            message_template: setting.message_template ?? '',
        });

    useEffect(() => {
        setData({
            sms_enabled: setting.sms_enabled,
            email_enabled: setting.email_enabled,
            title: setting.title,
            message_template: setting.message_template ?? '',
        });
    }, [setting, setData]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/admin/notifications/${setting.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                            <Bell size={17} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-[var(--foreground)]">
                                {setting.event_label}
                            </h2>
                            <p className="text-xs text-[var(--muted-foreground)]">
                                {setting.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Alert title
                            </label>
                            <input
                                value={data.title}
                                onChange={(event) =>
                                    setData('title', event.target.value)
                                }
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                maxLength={120}
                                required
                            />
                            {errors.title && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.title}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 xl:row-span-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Message template
                            </label>
                            <textarea
                                value={data.message_template}
                                onChange={(event) =>
                                    setData(
                                        'message_template',
                                        event.target.value,
                                    )
                                }
                                className="min-h-[94px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                maxLength={1000}
                            />
                            {errors.message_template && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.message_template}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)]">
                                <input
                                    type="checkbox"
                                    checked={data.sms_enabled}
                                    onChange={(event) =>
                                        setData(
                                            'sms_enabled',
                                            event.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-[var(--border)]"
                                />
                                <MessageSquareText size={15} />
                                SMS
                            </label>
                            <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)]">
                                <input
                                    type="checkbox"
                                    checked={data.email_enabled}
                                    onChange={(event) =>
                                        setData(
                                            'email_enabled',
                                            event.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-[var(--border)]"
                                />
                                <Mail size={15} />
                                Email
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 text-[13px] font-semibold text-[var(--primary-foreground)] shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    <Save size={14} />
                    {processing
                        ? 'Saving...'
                        : recentlySuccessful
                          ? 'Saved'
                          : 'Save'}
                </button>
            </div>
        </form>
    );
}
