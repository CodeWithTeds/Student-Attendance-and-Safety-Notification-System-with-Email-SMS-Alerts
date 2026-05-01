export interface StudentOption {
    id: number;
    name: string;
    email: string;
    student_number?: string | null;
}

export interface Guardian {
    id: number;
    name: string;
    email: string;
    role: string;
    status?: string;
    guardian_phone?: string | null;
    notification_sms_enabled: boolean;
    notification_email_enabled: boolean;
    created_at: string;
    updated_at: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    children?: StudentOption[];
}

export interface PaginatedGuardians {
    data: Guardian[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface GuardianForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    guardian_phone: string;
    notification_sms_enabled: boolean;
    notification_email_enabled: boolean;
    student_ids: number[];
}
