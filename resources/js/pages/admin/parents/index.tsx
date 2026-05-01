import DataTablePagination from '@/components/common/DataTablePagination';
import AddGuardianModal from '@/features/guardians/components/AddGuardianModal';
import EditGuardianModal from '@/features/guardians/components/EditGuardianModal';
import GuardianTable from '@/features/guardians/components/GuardianTable';
import GuardianToolbar from '@/features/guardians/components/GuardianToolbar';
import { Guardian, StudentOption } from '@/features/guardians/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface PaginatedGuardians {
    data: Guardian[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    guardians: { data: Guardian[]; meta: Omit<PaginatedGuardians, 'data'> };
    students: { data: StudentOption[] };
}

export default function ParentsIndex({ guardians, students }: Props) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [guardianToEdit, setGuardianToEdit] = useState<Guardian | null>(null);

    const data: Guardian[] = guardians?.data ?? [];
    const studentOptions: StudentOption[] = students?.data ?? [];
    const meta = guardians?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
        links: [],
    };

    const filtered = data.filter((guardian) => {
        const searchValue = search.toLowerCase();
        const studentNames = (guardian.children ?? [])
            .map((student) => student.name.toLowerCase())
            .join(' ');

        return (
            guardian.name.toLowerCase().includes(searchValue) ||
            guardian.email.toLowerCase().includes(searchValue) ||
            (guardian.guardian_phone ?? '')
                .toLowerCase()
                .includes(searchValue) ||
            studentNames.includes(searchValue)
        );
    });

    const toggleAll = () => {
        const allSelected =
            filtered.length > 0 &&
            filtered.every((guardian) => selected.includes(guardian.id));
        setSelected(allSelected ? [] : filtered.map((guardian) => guardian.id));
    };

    const toggleOne = (id: number) => {
        setSelected((previous) =>
            previous.includes(id)
                ? previous.filter((selectedId) => selectedId !== id)
                : [...previous, id],
        );
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    const handleEdit = (guardian: Guardian) => {
        setGuardianToEdit(guardian);
        setIsEditModalOpen(true);
    };

    const handleExport = () => {
        if (filtered.length === 0) return;

        const headers = [
            'ID',
            'Name',
            'Email',
            'SMS Contact',
            'SMS Enabled',
            'Email Enabled',
            'Linked Students',
            'Created At',
        ];
        const csvContent = [
            headers.join(','),
            ...filtered.map((guardian) =>
                [
                    guardian.id,
                    `"${guardian.name}"`,
                    `"${guardian.email}"`,
                    `"${guardian.guardian_phone || 'Not set'}"`,
                    guardian.notification_sms_enabled ? 'Yes' : 'No',
                    guardian.notification_email_enabled ? 'Yes' : 'No',
                    `"${(guardian.children ?? []).map((student) => student.name).join('; ') || 'None'}"`,
                    `"${new Date(guardian.created_at).toLocaleDateString()}"`,
                ].join(','),
            ),
        ].join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            `guardians_export_${new Date().getTime()}.csv`,
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Parent / Guardian Management" />

            <GuardianToolbar
                search={search}
                onSearchChange={setSearch}
                selectedCount={selected.length}
                onAddClick={() => setIsAddModalOpen(true)}
                onExport={handleExport}
            />

            <GuardianTable
                guardians={filtered}
                selected={selected}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
                onEdit={handleEdit}
                meta={meta}
            />

            <DataTablePagination meta={meta} onPageChange={handlePageChange} />

            <AddGuardianModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                students={studentOptions}
            />

            <EditGuardianModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setGuardianToEdit(null);
                }}
                guardian={guardianToEdit}
                students={studentOptions}
            />
        </div>
    );
}

ParentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Parent / Guardian Management', href: '/admin/parents' },
    ],
};
