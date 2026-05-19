import DataTablePagination from '@/components/common/DataTablePagination';
import StudentAttendanceTable from '@/features/student-attendance/components/StudentAttendanceTable';
import StudentAttendanceToolbar from '@/features/student-attendance/components/StudentAttendanceToolbar';
import type { StudentAttendanceRecord, StudentAttendanceRecordsProps } from '@/features/student-attendance/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentAttendanceRecords({ attendanceRecords }: StudentAttendanceRecordsProps) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>([]);

    const data: StudentAttendanceRecord[] = attendanceRecords?.data ?? [];
    const meta = attendanceRecords?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
        links: [],
    };

    const filtered = data.filter((record) => {
        const searchValue = search.toLowerCase();
        const section = record.student.current_section;
        const schedule = record.schedule ?? section?.schedule ?? null;
        const haystack = [
            record.event_label,
            record.status_label,
            record.schedule_status,
            record.scanned_at_full_display,
            record.student.name,
            record.student.student_number,
            section?.name,
            section?.grade_level?.name,
            schedule?.time_in_display,
            schedule?.time_out_display,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return haystack.includes(searchValue);
    });

    const toggleAll = () => {
        const allSelected = filtered.length > 0 && filtered.every((record) => selected.includes(record.id));
        setSelected(allSelected ? [] : filtered.map((record) => record.id));
    };

    const toggleOne = (id: number) => {
        setSelected((previous) => (previous.includes(id) ? previous.filter((selectedId) => selectedId !== id) : [...previous, id]));
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    const handleExport = () => {
        if (filtered.length === 0) return;

        const headers = ['ID', 'Event', 'Status', 'Scanned At', 'Schedule', 'Section'];
        const csvContent = [
            headers.join(','),
            ...filtered.map((record) => {
                const section = record.student.current_section;
                const schedule = record.schedule ?? section?.schedule ?? null;

                return [
                    record.id,
                    `"${record.event_label}"`,
                    `"${record.schedule_status ?? record.status_label}"`,
                    `"${record.scanned_at_full_display}"`,
                    `"${schedule ? `${schedule.time_in_display} - ${schedule.time_out_display}` : 'No schedule'}"`,
                    `"${section ? `${section.grade_level?.name ?? ''} ${section.name}`.trim() : 'Not assigned'}"`,
                ].join(',');
            }),
        ].join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_records_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Attendance Records" />

            <StudentAttendanceToolbar search={search} onSearchChange={setSearch} selectedCount={selected.length} onExport={handleExport} />

            <StudentAttendanceTable records={filtered} selected={selected} onToggleAll={toggleAll} onToggleOne={toggleOne} meta={meta} />

            <DataTablePagination meta={meta} onPageChange={handlePageChange} />
        </div>
    );
}

StudentAttendanceRecords.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Attendance Records', href: '/student/attendance-records' },
    ],
};
