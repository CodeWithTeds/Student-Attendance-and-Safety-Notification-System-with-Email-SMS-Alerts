import { Download, Search } from 'lucide-react';

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
    selectedCount: number;
    onExport: () => void;
}

export default function StudentAttendanceToolbar({ search, onSearchChange, selectedCount, onExport }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] bg-[var(--background)] p-4">
            <div className="relative min-w-[200px] max-w-[320px] flex-1">
                <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-[13px] text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                    placeholder="Search attendance..."
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </div>

            {selectedCount > 0 && (
                <span className="rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                    {selectedCount} selected
                </span>
            )}

            <div className="flex-1" />

            <button
                onClick={onExport}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
            >
                <Download size={14} /> Export
            </button>
        </div>
    );
}
