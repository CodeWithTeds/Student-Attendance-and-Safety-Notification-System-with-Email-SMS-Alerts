export type NotificationEventType =
    | 'attendance'
    | 'absence'
    | 'late'
    | 'announcement';

export interface NotificationSetting {
    id: number;
    event_type: NotificationEventType;
    event_label: string;
    description: string;
    sms_enabled: boolean;
    email_enabled: boolean;
    title: string;
    message_template: string | null;
    created_at: string;
    updated_at: string;
}

export interface NotificationSettingForm {
    sms_enabled: boolean;
    email_enabled: boolean;
    title: string;
    message_template: string;
}
