import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DataTablePagination from '@/components/common/DataTablePagination';
import { QrCodeTable } from '@/features/qr-codes/components/QrCodeTable';
import { QrCodeToolbar } from '@/features/qr-codes/components/QrCodeToolbar';
import type { QrCodeFilters, QrCodeMeta, QrCodeStudent } from '@/features/qr-codes/types';
import StudentIdCard from '@/features/students/components/StudentIdCard';

interface Props {
    students: {
        data: QrCodeStudent[];
        meta: QrCodeMeta;
    };
    filters: QrCodeFilters;
}

function cleanFilters(filters: QrCodeFilters): QrCodeFilters {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined),
    ) as QrCodeFilters;
}

export default function QrCodesIndex({ students, filters }: Props) {
    const [selected, setSelected] = useState<number[]>([]);
    const [activeFilters, setActiveFilters] = useState<QrCodeFilters>(filters ?? {});
    const [activeStudent, setActiveStudent] = useState<QrCodeStudent | null>(null);

    const data = students?.data ?? [];
    const meta = students?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
        links: [],
    };

    const applyFilters = (nextFilters: QrCodeFilters) => {
        setActiveFilters(nextFilters);
        router.get('/admin/qr-codes', cleanFilters(nextFilters), {
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
            '/admin/qr-codes',
            { ...cleanFilters(activeFilters), page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const toggleAll = () => {
        const allSelected =
            data.length > 0 && data.every((student) => selected.includes(student.id));

        setSelected(allSelected ? [] : data.map((student) => student.id));
    };

    const toggleOne = (id: number) => {
        setSelected((previous) =>
            previous.includes(id)
                ? previous.filter((selectedId) => selectedId !== id)
                : [...previous, id],
        );
    };

    const handleGenerate = (student: QrCodeStudent) => {
        router.post(`/admin/qr-codes/${student.id}/generate`, {}, { preserveScroll: true });
    };

    const handleReset = (student: QrCodeStudent) => {
        if (confirm(`Reset the QR code for ${student.name}? The previous QR code will stop working.`)) {
            router.post(`/admin/qr-codes/${student.id}/reset`, {}, { preserveScroll: true });
        }
    };

    const handleExport = () => {
        const selectedStudents = data.filter((student) => selected.includes(student.id));

        if (selectedStudents.length === 0) {
            return;
        }

        const rows = [
            ['ID', 'Name', 'Email', 'Student Number', 'QR Status', 'QR Value'],
            ...selectedStudents.map((student) => [
                student.id,
                `"${student.name}"`,
                `"${student.email}"`,
                `"${student.student_number ?? ''}"`,
                student.qr_code_value ? 'Generated' : 'Missing',
                `"${student.qr_code_value ?? ''}"`,
            ]),
        ];
        const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `student_qr_codes_${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="QR Code Management" />

            <QrCodeToolbar
                filters={activeFilters}
                selectedCount={selected.length}
                onFilterChange={applyFilters}
                onClear={() => applyFilters({})}
                onExport={handleExport}
            />

            <QrCodeTable
                students={data}
                selected={selected}
                meta={meta}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
                onGenerate={handleGenerate}
                onReset={handleReset}
                onView={setActiveStudent}
            />

            <DataTablePagination meta={meta} onPageChange={handlePageChange} />

            {activeStudent && (
                <StudentIdCard
                    student={activeStudent}
                    onClose={() => setActiveStudent(null)}
                />
            )}
        </div>
    );
}

QrCodesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'QR Code Management', href: '/admin/qr-codes' },
    ],
};
