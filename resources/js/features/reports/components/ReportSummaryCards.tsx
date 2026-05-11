import { Activity, LogIn, LogOut, Users } from 'lucide-react';
import type { ReportSummary } from '../types';

interface ReportSummaryCardsProps {
    summary: ReportSummary;
}

interface SummaryCard {
    label: string;
    value: number;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
}

export function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
    const cards: SummaryCard[] = [
        {
            label:      'Total Records',
            value:      summary.total_records,
            icon:       Activity,
            colorClass: 'text-[var(--primary)]',
            bgClass:    'bg-[var(--primary)]/10',
        },
        {
            label:      'Check-ins',
            value:      summary.total_check_ins,
            icon:       LogIn,
            colorClass: 'text-emerald-600',
            bgClass:    'bg-emerald-50',
        },
        {
            label:      'Check-outs',
            value:      summary.total_check_outs,
            icon:       LogOut,
            colorClass: 'text-orange-600',
            bgClass:    'bg-orange-50',
        },
        {
            label:      'Unique Students',
            value:      summary.unique_students,
            icon:       Users,
            colorClass: 'text-violet-600',
            bgClass:    'bg-violet-50',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.label}
                        className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm"
                    >
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.bgClass} ${card.colorClass}`}
                        >
                            <Icon size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                                {card.label}
                            </p>
                            <p className="text-2xl font-bold text-[var(--foreground)]">
                                {card.value.toLocaleString()}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
