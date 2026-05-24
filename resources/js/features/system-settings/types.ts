export interface SystemSettings {
    id: number;
    school_name: string;
    school_id: string | null;
    school_email: string | null;
    school_phone: string | null;
    school_address: string | null;
    sms_provider: string | null;
    sms_api_key_configured: boolean;
    sms_sender_id: string | null;
    mail_mailer: string | null;
    mail_host: string | null;
    mail_port: number | null;
    mail_username: string | null;
    mail_password_configured: boolean;
    mail_encryption: string | null;
    mail_from_address: string | null;
    mail_from_name: string | null;
    role_permissions: Record<string, string[]>;
    updated_at: string | null;
    updated_at_display: string | null;
}

export interface RoleOption {
    value: string;
    label: string;
}

export interface PermissionOption {
    key: string;
    label: string;
}

export interface PermissionGroup {
    key: string;
    label: string;
    permissions: PermissionOption[];
}

export interface SystemSettingsForm {
    school_name: string;
    school_id: string;
    school_email: string;
    school_phone: string;
    school_address: string;
    sms_provider: string;
    sms_api_key: string;
    sms_sender_id: string;
    mail_mailer: string;
    mail_host: string;
    mail_port: string;
    mail_username: string;
    mail_password: string;
    mail_encryption: string;
    mail_from_address: string;
    mail_from_name: string;
}
