import { Download, GraduationCap, Plus, Search, UserRoundPlus } from 'lucide-react';

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
    onAddGradeLevel: () => void;
    onAddAdviser: () => void;
    onAddSection: () => void;
    onExport: () => void;
}

export default function ClassSectionToolbar({
    search,
    onSearchChange,
    onAddGradeLevel,
    onAddAdviser,
    onAddSection,
    onExport,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] bg-[var(--background)] p-4">
            <div className="relative min-w-[220px] max-w-[340px] flex-1">
                <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-[13px] text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                    placeholder="Search sections..."
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </div>

            <div className="flex-1" />

            <button
                onClick={onExport}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
            >
                <Download size={14} /> Export
            </button>

            <button
                onClick={onAddGradeLevel}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
            >
                <GraduationCap size={14} /> Grade Level
            </button>

            <button
                onClick={onAddAdviser}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
            >
                <UserRoundPlus size={14} /> Adviser
            </button>

            <button
                onClick={onAddSection}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 text-[13px] font-medium text-[var(--primary-foreground)] shadow-sm transition-colors hover:opacity-90"
            >
                <Plus size={14} /> Section
            </button>
        </div>
    );
}
