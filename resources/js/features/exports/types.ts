import type {
    DropdownSection,
    DropdownStudent,
    ReportFilters,
    ReportResult,
    ReportType,
} from '@/features/reports/types';

export type ExportFormat = 'csv' | 'pdf';

export type ExportFilters = ReportFilters;

export type ExportReport = ReportResult;

export type ExportReportType = ReportType;

export type ExportDropdownStudent = DropdownStudent;

export type ExportDropdownSection = DropdownSection;
