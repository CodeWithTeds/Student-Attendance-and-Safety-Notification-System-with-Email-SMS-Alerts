export type AttendanceEventType = 'check_in' | 'check_out';

export interface StudentResource {
    id: number;
    name: string;
    email: string;
    student_id: string | null;
    student_number: string | null;
}

export interface AttendanceLogResource {
    id: number;
    event_type: AttendanceEventType;
    event_label: string;
    status_label: string;
    scanned_at: string;
    scanned_at_display: string;
    schedule_status?: string;
    student: StudentResource;
}

export interface AttendanceApiResponse {
    data: AttendanceLogResource;
}

export interface AttendanceApiError {
    message?: string;
    data?: {
        qr_code_value?: string[];
        event_type?: string[];
    };
    errors?: {
        qr_code_value?: string[];
        event_type?: string[];
    };
}
