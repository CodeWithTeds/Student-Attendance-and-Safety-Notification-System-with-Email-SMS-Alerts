import AddStudentModal from '@/features/students/components/AddStudentModal';
import EditStudentModal from '@/features/students/components/EditStudentModal';
import BulkAssignSectionModal from '@/features/students/components/BulkAssignSectionModal';
import StudentIdCard from '@/features/students/components/StudentIdCard';
import StudentTable from '@/features/students/components/StudentTable';
import StudentToolbar from '@/features/students/components/StudentToolbar';
import { Section, User } from '@/features/students/types';
import DataTablePagination from '@/components/common/DataTablePagination';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    users: { data: User[]; meta: Omit<PaginatedUsers, 'data'> };
    sections: { data: Section[] };
}

export default function StudentsIndex({ users, sections }: Props) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
    const [activeQrStudent, setActiveQrStudent] = useState<User | null>(null);
    const [studentToEdit, setStudentToEdit] = useState<User | null>(null);

    const data: User[] = users?.data ?? [];
    const meta = users?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
    };

    const filtered = data.filter((u) => {
        const searchValue = search.toLowerCase();
        return (
            u.name.toLowerCase().includes(searchValue) ||
            u.email.toLowerCase().includes(searchValue) ||
            (u.student_number ?? '').toLowerCase().includes(searchValue)
        );
    });

    const toggleAll = () => {
        const allSelected = filtered.length > 0 && filtered.every((u) => selected.includes(u.id));
        setSelected(allSelected ? [] : filtered.map((u) => u.id));
    };

    const toggleOne = (id: number) => {
        setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    const handleApprove = (id: number) => {
        if (confirm('Approve this student and generate a QR code?')) {
            router.post(`/admin/students/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    const handleEdit = (student: User) => {
        setStudentToEdit(student);
        setIsEditModalOpen(true);
    };

    const handleExport = () => {
        if (filtered.length === 0) return;

        const headers = ['ID', 'Name', 'Email', 'Student Number', 'Status', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...filtered.map((s) =>
                [
                    s.id,
                    `"${s.name}"`,
                    `"${s.email}"`,
                    `"${s.student_number || 'Pending'}"`,
                    `"${s.status || 'pending'}"`,
                    `"${new Date(s.created_at).toLocaleDateString()}"`,
                ].join(','),
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `students_export_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all m-4">
            <Head title="Student Management" />

            <StudentToolbar
                search={search}
                onSearchChange={setSearch}
                selectedCount={selected.length}
                onAddClick={() => setIsAddModalOpen(true)}
                onBulkAssignClick={() => setIsBulkAssignModalOpen(true)}
                onExport={handleExport}
            />

            <StudentTable
                students={filtered}
                selected={selected}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
                onViewQr={setActiveQrStudent}
                onEdit={handleEdit}
                onApprove={handleApprove}
                meta={meta}
            />

            <DataTablePagination meta={meta} onPageChange={handlePageChange} />

            <AddStudentModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                sections={sections?.data ?? []}
            />

            <EditStudentModal 
                isOpen={isEditModalOpen} 
                onClose={() => {
                    setIsEditModalOpen(false);
                    setStudentToEdit(null);
                }} 
                student={studentToEdit}
                sections={sections?.data ?? []}
            />
 
            <BulkAssignSectionModal
                isOpen={isBulkAssignModalOpen}
                onClose={() => {
                    setIsBulkAssignModalOpen(false);
                    setSelected([]);
                }}
                selectedStudents={data.filter(s => selected.includes(s.id))}
                sections={sections?.data ?? []}
            />

            {activeQrStudent && (
                <StudentIdCard 
                    student={activeQrStudent} 
                    onClose={() => setActiveQrStudent(null)} 
                />
            )}
        </div>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Student Management', href: '/admin/students' },
    ],
};
