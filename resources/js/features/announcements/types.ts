import type { Guardian } from '@/features/guardians/types';

export type AnnouncementAudienceType = 'all_guardians' | 'selected_guardians';
export type AnnouncementStatus = 'sent' | 'partial' | 'failed';

export interface Announcement {
    id: number;
    title: string;
    message: string;
    sms_enabled: boolean;
    email_enabled: boolean;
    audience_type: AnnouncementAudienceType;
    audience_label: string;
    status: AnnouncementStatus;
    status_label: string;
    sent_at: string | null;
    sent_at_display: string | null;
    recipients_count: number;
    sms_sent_count: number;
    email_sent_count: number;
    creator?: {
        id: number;
        name: string;
        email: string;
    } | null;
    created_at: string;
    updated_at: string;
}

export interface AnnouncementMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface AnnouncementFilters {
    [key: string]: string | undefined;
    search?: string;
}

export interface AnnouncementForm {
    title: string;
    message: string;
    sms_enabled: boolean;
    email_enabled: boolean;
    audience_type: AnnouncementAudienceType;
    guardian_ids: number[];
}

export type GuardianOption = Guardian;
