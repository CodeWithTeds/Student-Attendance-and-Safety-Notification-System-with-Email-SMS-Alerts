export type ReportType = 'daily' | 'weekly' | 'monthly' | 'per_student' | 'per_section';

export interface ReportFilters {
    report_type: ReportType;
    date_from: string;
    date_to: string;
    student_id?: number | '';
    section_id?: number | '';
}

export interface ReportRow {
    label: string;
    check_ins: number;
    check_outs: number;
    total: number;
}

export interface ReportSummary {
    total_records: number;
    total_check_ins: number;
    total_check_outs: number;
    unique_students: number;
}

export interface ReportResult {
    rows: ReportRow[];
    summary: ReportSummary;
}

export interface AllReportsResult {
    summary:     ReportSummary;
    daily:       ReportRow[];
    weekly:      ReportRow[];
    monthly:     ReportRow[];
    per_student: ReportRow[];
    per_section: ReportRow[];
}

export interface DropdownStudent {
    id: number;
    name: string;
    student_number: string | null;
}

export interface DropdownSection {
    id: number;
    name: string;
    school_year: string | null;
    grade_level?: {
        id: number;
        name: string;
    } | null;
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
    daily:       'Daily',
    weekly:      'Weekly',
    monthly:     'Monthly',
    per_student: 'Per Student',
    per_section: 'Per Section',
};
