export interface QrCodeStudent {
    id: number;
    name: string;
    email: string;
    role: string;
    status?: string;
    student_number?: string | null;
    qr_code_value?: string | null;
    qr_code_svg?: string | null;
    created_at: string;
    updated_at: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    current_section?: {
        id: number;
        name: string;
        school_year: string;
        grade_level?: {
            id: number;
            name: string;
        };
    } | null;
}

export interface QrCodeFilters {
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
