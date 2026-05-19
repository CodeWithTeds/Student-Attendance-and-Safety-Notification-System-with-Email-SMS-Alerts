export interface QrCodeStudent {
    id: number;
    name: string;
    email: string;
    role: string;
    status?: string;
    student_number?: string | null;
    qr_code_value?: string | null;
    qr_code_svg?: string | null;
    qr_code_fingerprint?: string | null;
    qr_code_updated_at_display?: string | null;
    created_at: string;
    updated_at: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    current_section?: {
        id: number;
        grade_level_id: number;
        name: string;
        school_year: string;
        schedule?: {
            id: number;
            section_id?: number;
            time_in: string;
            time_out: string;
            time_in_display: string;
            time_out_display: string;
        } | null;
        grade_level?: {
            id: number;
            name: string;
        };
    } | null;
}

export interface QrCodeFilters {
    [key: string]: 'generated' | 'missing' | '' | string | undefined;
    search?: string;
    qr_status?: 'generated' | 'missing' | '';
}

export interface QrCodeMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}
