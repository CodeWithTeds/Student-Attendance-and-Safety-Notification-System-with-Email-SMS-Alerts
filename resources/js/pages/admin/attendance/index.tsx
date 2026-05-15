import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DataTablePagination from '@/components/common/DataTablePagination';
import { AttendanceHistoryPanel } from '@/features/attendance/components/AttendanceHistoryPanel';
import { AttendanceTable } from '@/features/attendance/components/AttendanceTable';
import { AttendanceToolbar } from '@/features/attendance/components/AttendanceToolbar';
import { EditAttendanceModal } from '@/features/attendance/components/EditAttendanceModal';
import type { AttendanceFilters, AttendanceMeta, AttendanceRecord } from '@/features/attendance/types';

interface Props {
    attendanceRecords: {
        data: AttendanceRecord[];
        meta: AttendanceMeta;
    };
    filters: AttendanceFilters;
    sections: any[];
}

function cleanFilters(filters: AttendanceFilters): AttendanceFilters {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined),
    ) as AttendanceFilters;
}

export default function AttendanceIndex({ attendanceRecords, filters, sections }: Props) {
    const [selected, setSelected] = useState<number[]>([]);
    const [activeFilters, setActiveFilters] = useState<AttendanceFilters>(filters ?? {});
    const [recordToEdit, setRecordToEdit] = useState<AttendanceRecord | null>(null);
    const [historyRecord, setHistoryRecord] = useState<AttendanceRecord | null>(null);

    const records = attendanceRecords?.data ?? [];
    const meta = attendanceRecords?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
        links: [],
    };

    const applyFilters = (nextFilters: AttendanceFilters) => {
        setActiveFilters(nextFilters);
        router.get('/admin/attendance', cleanFilters(nextFilters), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) {
            return;
        }

        const page = new URL(url, window.location.origin).searchParams.get('page') ?? '1';

        router.get(
            '/admin/attendance',
            { ...cleanFilters(activeFilters), page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const toggleAll = () => {
        const allSelected =
            records.length > 0 && records.every((record) => selected.includes(record.id));

        setSelected(allSelected ? [] : records.map((record) => record.id));
    };

    const toggleOne = (id: number) => {
        setSelected((previous) =>
            previous.includes(id)
                ? previous.filter((selectedId) => selectedId !== id)
                : [...previous, id],
        );
    };

    const handleExport = () => {
        const selectedRecords = records.filter((record) => selected.includes(record.id));

        if (selectedRecords.length === 0) {
            return;
        }

        const rows = [
            ['ID', 'Student', 'Student Number', 'Event', 'Scanned At', 'Edit Count'],
            ...selectedRecords.map((record) => [
                record.id,
                `"${record.student.name}"`,
                `"${record.student.student_number ?? ''}"`,
                `"${record.event_label}"`,
                `"${record.scanned_at_full_display}"`,
                record.edit_history.length,
            ]),
        ];
        const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `attendance_export_${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Attendance Management" />

            <AttendanceToolbar
                filters={activeFilters}
                sections={sections}
                selectedCount={selected.length}
                onFilterChange={applyFilters}
                onClear={() => applyFilters({})}
                onExport={handleExport}
            />

            <AttendanceTable
                records={records}
                selected={selected}
                meta={meta}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
                onEdit={setRecordToEdit}
                onViewHistory={setHistoryRecord}
            />

            <DataTablePagination meta={meta} onPageChange={handlePageChange} />

            <EditAttendanceModal
                isOpen={recordToEdit !== null}
                record={recordToEdit}
                onClose={() => setRecordToEdit(null)}
            />

            <AttendanceHistoryPanel
                record={historyRecord}
                onClose={() => setHistoryRecord(null)}
            />
        </div>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Attendance Management', href: '/admin/attendance' },
    ],
};
