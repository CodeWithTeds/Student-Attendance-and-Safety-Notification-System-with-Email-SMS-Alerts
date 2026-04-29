import { Download, Plus, Search } from 'lucide-react';

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
    selectedCount: number;
    onAddClick: () => void;
}

export default function StudentToolbar({ search, onSearchChange, selectedCount, onAddClick }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] p-4 bg-[var(--background)]">
            <div className="relative flex-1 min-w-[200px] max-w-[320px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {selectedCount > 0 && (
                <span className="text-xs font-medium text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded-md">
                    {selectedCount} selected
                </span>
            )}

            <div className="flex-1" />

            <button 
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 text-[13px] font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
            >
                <Download size={14} /> Export
            </button>

            <button
                onClick={onAddClick}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 text-[13px] font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-colors shadow-sm"
            >
                <Plus size={14} /> Add Student
            </button>
        </div>
    );
}
