import type { User } from '@/types';

export type AuditLogCategory =
    | 'admin_action'
    | 'attendance_change'
    | 'notification';

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface ResourceCollection<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface AuditCategoryOption {
    value: AuditLogCategory;
    label: string;
}

export interface AuditFilters {
    [key: string]: string | undefined;
    search?: string;
    category?: AuditLogCategory;
    date?: string;
}

export interface AuditSummary {
    total_admin_logs: number;
    admin_actions: number;
    attendance_changes: number;
    notification_events: number;
}

export interface AuditLog {
    id: number;
    category: AuditLogCategory;
    category_label: string;
    action: string;
    action_label: string;
    description: string;
    metadata: Record<string, unknown>;
    ip_address: string | null;
    actor?: User | null;
    created_at: string;
    created_at_display: string;
}

export interface AttendanceChangeAudit {
    id: number;
    attendance_log_id: number;
    student?: User | null;
    editor?: User | null;
    old_event_type: string;
    old_event_label: string;
    new_event_type: string;
    new_event_label: string;
    old_scanned_at_display: string;
    new_scanned_at_display: string;
    note: string | null;
    created_at: string;
    created_at_display: string;
}

export interface NotificationHistory {
    id: number;
    announcement: {
        id: number | null;
        title: string | null;
        message: string | null;
        creator?: User | null;
    };
    guardian?: User | null;
    sms_status: string | null;
    email_status: string | null;
    sms_sent_at_display: string | null;
    email_sent_at_display: string | null;
    error_message: string | null;
    updated_at: string;
    updated_at_display: string;
}
