import type { LucideIcon } from 'lucide-react';

interface SummaryItem {
    label: string;
    value: string | number;
    tone?: 'default' | 'green' | 'blue' | 'orange' | 'red';
    icon: LucideIcon;
}

const toneClasses = {
    default: 'bg-[var(--secondary)] text-[var(--secondary-foreground)]',
    green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-rose-100 text-rose-700',
};

export default function ParentSummaryStrip({ items }: { items: SummaryItem[] }) {
    return (
        <div className="grid gap-2 border-b border-[var(--border)] bg-[var(--background)] p-3 sm:grid-cols-2 xl:grid-cols-4">
            {items.map(({ label, value, tone = 'default', icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
                        <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">{label}</p>
                        <p className="truncate text-base font-bold text-[var(--foreground)]">{value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
