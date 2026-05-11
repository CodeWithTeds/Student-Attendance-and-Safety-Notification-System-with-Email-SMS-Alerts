import { BarChart3 } from 'lucide-react';
import type { ReportRow, ReportType } from '../types';
import { REPORT_TYPE_LABELS } from '../types';

interface ReportTableProps {
    rows: ReportRow[];
    reportType: ReportType;
}

function columnLabel(reportType: ReportType): string {
    switch (reportType) {
        case 'daily':
            return 'Date';
        case 'weekly':
            return 'Week';
        case 'monthly':
            return 'Month';
        case 'per_student':
            return 'Student';
        case 'per_section':
            return 'Section';
    }
}

export function ReportTable({ rows, reportType }: ReportTableProps) {
    if (rows.length === 0) {
        return (
            <div className="flex h-52 flex-col items-center justify-center gap-2 text-center">
                <BarChart3 size={34} className="text-[var(--muted-foreground)]" />
                <p className="text-sm font-semibold text-[var(--foreground)]">
                    No attendance data found
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                    Try adjusting your filters or selecting a wider date range.
                </p>
            </div>
        );
    }

    const groupCol = columnLabel(reportType);

    return (
        <div className="min-h-0 flex-1 overflow-auto">
            <div className="px-4 pb-2 pt-0">
                <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                    {REPORT_TYPE_LABELS[reportType]} Report — {rows.length} row{rows.length !== 1 ? 's' : ''}
                </p>
            </div>

            <table className="w-full min-w-[600px] border-collapse">
                <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--muted)]/35 text-left">
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            {groupCol}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Check-ins
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Check-outs
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Total Events
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {rows.map((row, index) => (
                        <tr
                            key={index}
                            className="transition-colors hover:bg-[var(--muted)]/30"
                        >
                            <td className="px-4 py-3">
                                <span className="text-sm font-medium text-[var(--foreground)]">
                                    {row.label}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                    {row.check_ins}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className="inline-flex items-center justify-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                                    {row.check_outs}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className="text-sm font-bold text-[var(--foreground)]">
                                    {row.total}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
