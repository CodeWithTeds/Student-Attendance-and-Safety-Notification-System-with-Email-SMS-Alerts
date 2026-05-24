import { Head, useForm } from '@inertiajs/react';
import {
    Building2,
    Check,
    KeyRound,
    Mail,
    MessageSquareText,
    Save,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import type {
    SystemSettings,
    SystemSettingsForm,
} from '@/features/system-settings/types';

interface Resource<T> {
    data: T;
}

interface Props {
    settings: Resource<SystemSettings>;
}

const fieldInputClass =
    'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5';

function textValue(value: string | number | null | undefined): string {
    return value === null || value === undefined ? '' : String(value);
}

export default function SystemSettingsIndex({
    settings,
}: Props) {
    const current = settings.data;
    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm<SystemSettingsForm>({
            school_name: textValue(current.school_name),
            school_id: textValue(current.school_id),
            school_email: textValue(current.school_email),
            school_phone: textValue(current.school_phone),
            school_address: textValue(current.school_address),
            sms_provider: textValue(current.sms_provider),
            sms_api_key: '',
            sms_sender_id: textValue(current.sms_sender_id),
            mail_mailer: textValue(current.mail_mailer),
            mail_host: textValue(current.mail_host),
            mail_port: textValue(current.mail_port),
            mail_username: textValue(current.mail_username),
            mail_password: '',
            mail_encryption: textValue(current.mail_encryption),
            mail_from_address: textValue(current.mail_from_address),
            mail_from_name: textValue(current.mail_from_name),
        });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put('/admin/system-settings', {
            preserveScroll: true,
        });
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="System Settings" />

            <div className="border-b border-[var(--border)] p-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-[var(--foreground)]">
                            System Settings
                        </h1>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            Manage school information and messaging
                            credentials.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
                        <CredentialBadge
                            configured={current.sms_api_key_configured}
                            label="SMS key"
                        />
                        <CredentialBadge
                            configured={current.mail_password_configured}
                            label="Email password"
                        />
                        {current.updated_at_display && (
                            <span className="rounded-lg border border-[var(--border)] px-3 py-2">
                                Updated {current.updated_at_display}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="min-h-0 flex-1 overflow-auto"
            >
                <div className="grid grid-cols-1 gap-4 p-4 2xl:grid-cols-[1fr_1fr]">
                    <SettingsSection
                        icon={Building2}
                        title="School Information"
                    >
                        <Field
                            label="School name"
                            error={errors.school_name}
                            className="xl:col-span-2"
                        >
                            <input
                                value={data.school_name}
                                onChange={(event) =>
                                    setData('school_name', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={160}
                                required
                            />
                        </Field>
                        <Field label="School ID" error={errors.school_id}>
                            <input
                                value={data.school_id}
                                onChange={(event) =>
                                    setData('school_id', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={80}
                            />
                        </Field>
                        <Field label="Contact email" error={errors.school_email}>
                            <input
                                type="email"
                                value={data.school_email}
                                onChange={(event) =>
                                    setData('school_email', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={160}
                            />
                        </Field>
                        <Field label="Phone" error={errors.school_phone}>
                            <input
                                value={data.school_phone}
                                onChange={(event) =>
                                    setData('school_phone', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={40}
                            />
                        </Field>
                        <Field
                            label="Address"
                            error={errors.school_address}
                            className="xl:col-span-2"
                        >
                            <textarea
                                value={data.school_address}
                                onChange={(event) =>
                                    setData(
                                        'school_address',
                                        event.target.value,
                                    )
                                }
                                className={`${fieldInputClass} min-h-24 py-2`}
                                maxLength={500}
                            />
                        </Field>
                    </SettingsSection>

                    <SettingsSection
                        icon={MessageSquareText}
                        title="SMS API"
                    >
                        <Field label="Provider" error={errors.sms_provider}>
                            <input
                                value={data.sms_provider}
                                onChange={(event) =>
                                    setData('sms_provider', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={80}
                            />
                        </Field>
                        <Field label="Sender ID" error={errors.sms_sender_id}>
                            <input
                                value={data.sms_sender_id}
                                onChange={(event) =>
                                    setData('sms_sender_id', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={40}
                            />
                        </Field>
                        <Field
                            label={
                                current.sms_api_key_configured
                                    ? 'API key replacement'
                                    : 'API key'
                            }
                            error={errors.sms_api_key}
                            className="xl:col-span-2"
                        >
                            <input
                                type="password"
                                value={data.sms_api_key}
                                onChange={(event) =>
                                    setData('sms_api_key', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={1000}
                                autoComplete="new-password"
                            />
                        </Field>
                    </SettingsSection>

                    <SettingsSection icon={Mail} title="Email API">
                        <Field label="Mailer" error={errors.mail_mailer}>
                            <input
                                value={data.mail_mailer}
                                onChange={(event) =>
                                    setData('mail_mailer', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={40}
                            />
                        </Field>
                        <Field label="Host" error={errors.mail_host}>
                            <input
                                value={data.mail_host}
                                onChange={(event) =>
                                    setData('mail_host', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={160}
                            />
                        </Field>
                        <Field label="Port" error={errors.mail_port}>
                            <input
                                type="number"
                                value={data.mail_port}
                                onChange={(event) =>
                                    setData('mail_port', event.target.value)
                                }
                                className={fieldInputClass}
                                min={1}
                                max={65535}
                            />
                        </Field>
                        <Field label="Encryption" error={errors.mail_encryption}>
                            <select
                                value={data.mail_encryption}
                                onChange={(event) =>
                                    setData(
                                        'mail_encryption',
                                        event.target.value,
                                    )
                                }
                                className={fieldInputClass}
                            >
                                <option value="">None</option>
                                <option value="tls">TLS</option>
                                <option value="ssl">SSL</option>
                            </select>
                        </Field>
                        <Field label="Username" error={errors.mail_username}>
                            <input
                                value={data.mail_username}
                                onChange={(event) =>
                                    setData('mail_username', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={160}
                            />
                        </Field>
                        <Field
                            label={
                                current.mail_password_configured
                                    ? 'Password replacement'
                                    : 'Password'
                            }
                            error={errors.mail_password}
                        >
                            <input
                                type="password"
                                value={data.mail_password}
                                onChange={(event) =>
                                    setData('mail_password', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={1000}
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field label="From address" error={errors.mail_from_address}>
                            <input
                                type="email"
                                value={data.mail_from_address}
                                onChange={(event) =>
                                    setData(
                                        'mail_from_address',
                                        event.target.value,
                                    )
                                }
                                className={fieldInputClass}
                                maxLength={160}
                            />
                        </Field>
                        <Field label="From name" error={errors.mail_from_name}>
                            <input
                                value={data.mail_from_name}
                                onChange={(event) =>
                                    setData('mail_from_name', event.target.value)
                                }
                                className={fieldInputClass}
                                maxLength={160}
                            />
                        </Field>
                    </SettingsSection>

                </div>

                <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[var(--border)] bg-[var(--background)] p-4">
                    {recentlySuccessful && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                            <Check size={15} />
                            Saved
                        </span>
                    )}
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        <Save size={15} />
                        {processing ? 'Saving...' : 'Save settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function CredentialBadge({
    configured,
    label,
}: {
    configured: boolean;
    label: string;
}) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2">
            <KeyRound size={14} />
            {label}: {configured ? 'Saved' : 'Not set'}
        </span>
    );
}

function SettingsSection({
    icon: Icon,
    title,
    children,
}: {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-lg border border-[var(--border)] p-4">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                    <Icon size={17} />
                </div>
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                    {title}
                </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {children}
            </div>
        </section>
    );
}

function Field({
    label,
    error,
    className,
    children,
}: {
    label: string;
    error?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <label className={`flex flex-col gap-1.5 ${className ?? ''}`}>
            <span className="text-xs font-semibold text-[var(--foreground)]">
                {label}
            </span>
            {children}
            {error && (
                <span className="text-[11px] font-medium text-red-500">
                    {error}
                </span>
            )}
        </label>
    );
}

SystemSettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'System Settings', href: '/admin/system-settings' },
    ],
};
