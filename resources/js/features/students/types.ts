export interface Section {
    id: number;
    name: string;
    grade_level_id: number;
    grade_level?: {
        id: number;
        name: string;
    };
    school_year?: string;
    schedule?: {
        id: number;
        section_id?: number;
        time_in: string;
        time_out: string;
        time_in_display: string;
        time_out_display: string;
    } | null;
}

export interface User {
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
    suffix?: string | null;
    gender?: string | null;
    date_of_birth?: string | null;
    place_of_birth?: string | null;
    nationality?: string | null;
    house_no?: string | null;
    street?: string | null;
    barangay?: string | null;
    city?: string | null;
    province?: string | null;
    zip_code?: string | null;
    guardian_phone?: string | null;
    parents?: User[];
    grade_level?: { id: number; name: string } | null;
    current_section?: Section | null;
}

export interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface AddStudentForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    section_ids: number[];
}

export interface EditStudentForm {
    name: string;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    student_number: string;
    password?: string;
    password_confirmation?: string;
    section_ids: number[];
}
