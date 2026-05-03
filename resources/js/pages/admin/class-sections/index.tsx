import DataTablePagination from '@/components/common/DataTablePagination';
import AdviserModal from '@/features/class-sections/components/AdviserModal';
import AssignStudentsModal from '@/features/class-sections/components/AssignStudentsModal';
import ClassSectionRegistry from '@/features/class-sections/components/ClassSectionRegistry';
import ClassSectionToolbar from '@/features/class-sections/components/ClassSectionToolbar';
import GradeLevelModal from '@/features/class-sections/components/GradeLevelModal';
import SectionModal from '@/features/class-sections/components/SectionModal';
import SectionTable from '@/features/class-sections/components/SectionTable';
import { Adviser, GradeLevel, PaginatedSections, Section, Student } from '@/features/class-sections/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface ResourceCollection<T> {
    data: T[];
}

interface Props {
    sections: PaginatedSections;
    gradeLevels: ResourceCollection<GradeLevel>;
    advisers: ResourceCollection<Adviser>;
    students: ResourceCollection<Student>;
}

export default function ClassSectionsIndex({ sections, gradeLevels, advisers, students }: Props) {
    const [search, setSearch] = useState('');
    const [isGradeLevelModalOpen, setIsGradeLevelModalOpen] = useState(false);
    const [isAdviserModalOpen, setIsAdviserModalOpen] = useState(false);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [gradeLevelToEdit, setGradeLevelToEdit] = useState<GradeLevel | null>(null);
    const [adviserToEdit, setAdviserToEdit] = useState<Adviser | null>(null);
    const [sectionToEdit, setSectionToEdit] = useState<Section | null>(null);
    const [sectionToAssign, setSectionToAssign] = useState<Section | null>(null);

    const data = sections?.data ?? [];
    const meta = sections?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    };
    const gradeLevelData = gradeLevels?.data ?? [];
    const adviserData = advisers?.data ?? [];
    const studentData = students?.data ?? [];

    const filteredSections = data.filter((section) => {
        const searchValue = search.toLowerCase();

        return (
            section.name.toLowerCase().includes(searchValue) ||
            section.school_year.toLowerCase().includes(searchValue) ||
            (section.grade_level?.name ?? '').toLowerCase().includes(searchValue) ||
            (section.adviser?.full_name ?? '').toLowerCase().includes(searchValue)
        );
    });

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    const handleEditGradeLevel = (gradeLevel: GradeLevel) => {
        setGradeLevelToEdit(gradeLevel);
        setIsGradeLevelModalOpen(true);
    };

    const handleEditAdviser = (adviser: Adviser) => {
        setAdviserToEdit(adviser);
        setIsAdviserModalOpen(true);
    };

    const handleEditSection = (section: Section) => {
        setSectionToEdit(section);
        setIsSectionModalOpen(true);
    };

    const handleAssignSection = (section: Section) => {
        setSectionToAssign(section);
        setIsAssignModalOpen(true);
    };

    const handleExport = () => {
        if (filteredSections.length === 0) return;

        const headers = ['ID', 'Grade Level', 'Section', 'School Year', 'Adviser', 'Students', 'Capacity'];
        const csvContent = [
            headers.join(','),
            ...filteredSections.map((section) =>
                [
                    section.id,
                    `"${section.grade_level?.name ?? ''}"`,
                    `"${section.name}"`,
                    `"${section.school_year}"`,
                    `"${section.adviser?.full_name ?? ''}"`,
                    section.students_count,
                    section.capacity ?? '',
                ].join(','),
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `class_sections_export_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all">
            <Head title="Class / Section Management" />

            <ClassSectionToolbar
                search={search}
                onSearchChange={setSearch}
                onAddGradeLevel={() => {
                    setGradeLevelToEdit(null);
                    setIsGradeLevelModalOpen(true);
                }}
                onAddAdviser={() => {
                    setAdviserToEdit(null);
                    setIsAdviserModalOpen(true);
                }}
                onAddSection={() => {
                    setSectionToEdit(null);
                    setIsSectionModalOpen(true);
                }}
                onExport={handleExport}
            />

            <SectionTable sections={filteredSections} meta={meta} onEdit={handleEditSection} onAssign={handleAssignSection} />

            <DataTablePagination meta={meta} onPageChange={handlePageChange} />

            <ClassSectionRegistry
                gradeLevels={gradeLevelData}
                advisers={adviserData}
                onEditGradeLevel={handleEditGradeLevel}
                onEditAdviser={handleEditAdviser}
            />

            <GradeLevelModal
                isOpen={isGradeLevelModalOpen}
                gradeLevel={gradeLevelToEdit}
                onClose={() => {
                    setIsGradeLevelModalOpen(false);
                    setGradeLevelToEdit(null);
                }}
            />

            <AdviserModal
                isOpen={isAdviserModalOpen}
                adviser={adviserToEdit}
                onClose={() => {
                    setIsAdviserModalOpen(false);
                    setAdviserToEdit(null);
                }}
            />

            <SectionModal
                isOpen={isSectionModalOpen}
                section={sectionToEdit}
                gradeLevels={gradeLevelData}
                advisers={adviserData}
                onClose={() => {
                    setIsSectionModalOpen(false);
                    setSectionToEdit(null);
                }}
            />

            <AssignStudentsModal
                isOpen={isAssignModalOpen}
                section={sectionToAssign}
                students={studentData}
                onClose={() => {
                    setIsAssignModalOpen(false);
                    setSectionToAssign(null);
                }}
            />
        </div>
    );
}

ClassSectionsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Class / Section Management', href: '/admin/class-sections' },
    ],
};
