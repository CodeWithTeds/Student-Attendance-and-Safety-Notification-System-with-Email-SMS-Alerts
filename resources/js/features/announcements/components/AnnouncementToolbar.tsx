import { Megaphone, Search } from 'lucide-react';

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
    onCreate: () => void;
}

export default function AnnouncementToolbar({
    search,
    onSearchChange,
    onCreate,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] bg-[var(--background)] p-4">
            <div className="relative max-w-[380px] min-w-[220px] flex-1">
                <Search
                    size={14}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                />
                <input
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-[13px] text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                    placeholder="Search announcements..."
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </div>

            <div className="flex-1" />

            <button
                onClick={onCreate}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 text-[13px] font-semibold text-[var(--primary-foreground)] shadow-sm transition-opacity hover:opacity-90"
            >
                <Megaphone size={14} />
                Send Announcement
            </button>
        </div>
    );
}
