export interface GradeLevel {
    id: number;
    name: string;
    code: string;
    sort_order: number;
    sections_count: number;
    created_at: string;
    updated_at: string;
}

export interface Adviser {
    id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    full_name: string;
    email?: string | null;
    phone?: string | null;
    sections_count: number;
    created_at: string;
    updated_at: string;
}

export interface Section {
    id: number;
    name: string;
    school_year: string;
    capacity?: number | null;
    students_count: number;
    grade_level?: GradeLevel | null;
    adviser?: Adviser | null;
    students?: Student[];
    created_at: string;
    updated_at: string;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    role: string;
    status?: string | null;
    student_number?: string | null;
    current_section?: Section | null;
    created_at: string;
    updated_at: string;
}

export interface PaginatedSections {
    data: Section[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export interface GradeLevelForm {
    name: string;
    code: string;
    sort_order: string;
}

export interface AdviserForm {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone: string;
}

export interface SectionForm {
    grade_level_id: string;
    adviser_id: string;
    name: string;
    school_year: string;
    capacity: string;
}

export interface AssignStudentsForm {
    student_ids: number[];
}
