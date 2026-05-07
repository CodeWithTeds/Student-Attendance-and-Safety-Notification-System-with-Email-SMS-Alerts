import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DataTablePagination from '@/components/common/DataTablePagination';
import SectionScheduleModal from '@/features/class-sections/components/SectionScheduleModal';
import type {
    PaginatedSections,
    Section,
} from '@/features/class-sections/types';
import ScheduleTable from '@/features/schedules/components/ScheduleTable';
import ScheduleToolbar from '@/features/schedules/components/ScheduleToolbar';

interface ScheduleFilters {
    search?: string;
}

interface Props {
    sections: PaginatedSections;
    filters: ScheduleFilters;
}

function cleanFilters(filters: ScheduleFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).filter(
            ([, value]) => value !== '' && value !== undefined,
        ),
    ) as Record<string, string>;
}

export default function SchedulesIndex({ sections, filters }: Props) {
    const [activeFilters, setActiveFilters] = useState<ScheduleFilters>(
        filters ?? {},
    );
    const [sectionToSchedule, setSectionToSchedule] = useState<Section | null>(
        null,
    );

    const data = sections?.data ?? [];
    const meta = sections?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    };

    const applyFilters = (nextFilters: ScheduleFilters) => {
        setActiveFilters(nextFilters);
        router.get('/admin/schedules', cleanFilters(nextFilters), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) {
            return;
        }

        const page =
            new URL(url, window.location.origin).searchParams.get('page') ??
            '1';

        router.get(
            '/admin/schedules',
            { ...cleanFilters(activeFilters), page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleExport = () => {
        if (data.length === 0) {
            return;
        }

        const rows = [
            [
                'ID',
                'Grade Level',
                'Section',
                'School Year',
                'Adviser',
                'Time In',
                'Time Out',
                'Students',
            ],
            ...data.map((section) => [
                section.id,
                `"${section.grade_level?.name ?? ''}"`,
                `"${section.name}"`,
                `"${section.school_year}"`,
                `"${section.adviser?.full_name ?? ''}"`,
                `"${section.schedule?.time_in_display ?? ''}"`,
                `"${section.schedule?.time_out_display ?? ''}"`,
                section.students_count,
            ]),
        ];
        const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `section_schedules_export_${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Schedule Management" />

            <ScheduleToolbar
                search={activeFilters.search ?? ''}
                onSearchChange={(search) => applyFilters({ search })}
                onExport={handleExport}
            />

            <ScheduleTable
                sections={data}
                meta={meta}
                onSchedule={setSectionToSchedule}
            />

            <DataTablePagination meta={meta} onPageChange={handlePageChange} />

            <SectionScheduleModal
                isOpen={sectionToSchedule !== null}
                section={sectionToSchedule}
                onClose={() => setSectionToSchedule(null)}
            />
        </div>
    );
}

SchedulesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Schedule Management', href: '/admin/schedules' },
    ],
};
