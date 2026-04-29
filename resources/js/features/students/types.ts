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
}
