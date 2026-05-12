import type { DropdownSection, DropdownStudent } from '@/features/reports/types';

export interface AbsenteeMonitorFilters {
    [key: string]: string | number | undefined;
    date_from: string;
    date_to: string;
    student_id?: number | '';
    section_id?: number | '';
    absence_threshold: number;
    late_threshold: number;
}

export interface AbsenteeMonitorSummary {
    monitored_students: number;
    flagged_students: number;
    total_absences: number;
    total_lates: number;
    school_days: number;
}

export interface AbsenteeMonitorRow {
    student: {
        id: number;
        name: string;
        email: string;
        student_number: string | null;
    };
    section: {
        id: number;
        name: string;
        school_year: string | null;
        time_in: string | null;
    } | null;
    absence_count: number;
    late_count: number;
    present_days: number;
    school_days: number;
    absence_dates: string[];
    late_dates: {
        date: string;
        time: string;
    }[];
    risk_score: number;
    risk_level: 'high' | 'watch';
}

export type AbsenteeDropdownStudent = DropdownStudent;

export type AbsenteeDropdownSection = DropdownSection;
