import type { AttendanceMeta, AttendanceRecord, AttendanceStudent } from '@/features/attendance/types';

export interface GuardianProfile {
    id: number;
    name: string;
    email: string;
    guardian_phone?: string | null;
    notification_sms_enabled: boolean;
    notification_email_enabled: boolean;
}

export type GuardianChild = AttendanceStudent;

export interface GuardianFilters {
    period?: 'daily' | 'monthly' | '';
    date?: string | null;
    month?: string | null;
    student_id?: string | number | null;
    event_type?: 'check_in' | 'check_out' | '';
    date_from?: string | null;
    date_to?: string | null;
    search?: string | null;
    channel?: 'sms' | 'email' | '';
    delivery_status?: 'sent' | 'skipped' | 'failed' | '';
    notification_search?: string | null;
}

export interface GuardianDashboardSummary {
    children: number;
    total_logs: number;
    check_ins: number;
    check_outs: number;
    late: number;
    on_time: number;
    completed: number;
}

export interface GuardianNotificationSummary {
    total_alerts: number;
    late_alerts: number;
    sms_enabled: boolean;
    email_enabled: boolean;
    sms_contact?: string | null;
    email_contact: string;
    linked_children: number;
}

export interface GuardianAnnouncementSummary {
    total_children: number;
    sms_enabled: boolean;
    email_enabled: boolean;
    sms_contact?: string | null;
    email_contact: string;
}

export interface ChildAttendanceSummary {
    id: number;
    name: string;
    student_number?: string | null;
    section: string;
    schedule: string;
    check_ins: number;
    check_outs: number;
    late: number;
    last_seen: string;
}

export interface DailyTrendPoint {
    label: string;
    date: string;
    check_ins: number;
    check_outs: number;
    late: number;
    total: number;
}

export interface NotificationHistory {
    id: number;
    announcement: {
        id: number | null;
        title: string | null;
        message: string | null;
    };
    sms_status?: string | null;
    email_status?: string | null;
    sms_sent_at_display?: string | null;
    email_sent_at_display?: string | null;
    error_message?: string | null;
    updated_at_display?: string | null;
}

export interface PaginatedRecords<T> {
    data: T[];
    meta: AttendanceMeta;
}

export type GuardianAttendanceRecord = AttendanceRecord;
