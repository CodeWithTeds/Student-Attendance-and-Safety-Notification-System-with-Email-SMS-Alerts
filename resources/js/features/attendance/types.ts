export type AttendanceEventType = 'check_in' | 'check_out';

export interface AttendanceStudent {
    id: number;
    name: string;
    email: string;
    student_number: string | null;
    current_section?: {
        id: number;
        name: string;
        school_year: string;
        schedule?: {
            id: number;
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

export interface AttendanceEditHistory {
    id: number;
    old_event_type: AttendanceEventType;
    old_event_label: string;
    new_event_type: AttendanceEventType;
    new_event_label: string;
    old_scanned_at: string;
    old_scanned_at_display: string;
    new_scanned_at: string;
    new_scanned_at_display: string;
    note: string | null;
    created_at: string;
    created_at_display: string;
    editor?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface AttendanceRecord {
    id: number;
    event_type: AttendanceEventType;
    event_label: string;
    status_label: string;
    scanned_at: string;
    scanned_at_display: string;
    scanned_at_full_display: string;
    student: AttendanceStudent;
    edit_history: AttendanceEditHistory[];
    created_at: string;
    updated_at: string;
}

export interface AttendanceFilters {
    [key: string]: AttendanceEventType | '' | string | undefined;
    search?: string;
    event_type?: AttendanceEventType | '';
    date?: string;
}

export interface AttendanceMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}
