import { CalendarClock, Pencil } from 'lucide-react';
import type { Section } from '@/features/class-sections/types';

interface Props {
    sections: Section[];
    meta: { from: number };
    onSchedule: (section: Section) => void;
}

export default function ScheduleTable({ sections, meta, onSchedule }: Props) {
    return (
        <div className="min-h-0 flex-1 overflow-auto bg-[var(--background)] px-4">
            <table className="w-full min-w-[980px] border-collapse text-[13px]">
                <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            #
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Section
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Adviser
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Time In
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Time Out
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-left text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Students
                        </th>
                        <th className="sticky top-0 z-10 bg-[var(--background)] px-3 py-3 text-right text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {sections.length === 0 ? (
                        <tr>
                            <td colSpan={7}>
                                <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
                                    <CalendarClock
                                        size={44}
                                        className="mb-4 opacity-20"
                                    />
                                    <p className="text-sm font-medium">
                                        No schedules found.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        sections.map((section, index) => (
                            <tr
                                key={section.id}
                                className="transition-colors hover:bg-[var(--accent)]/30"
                            >
                                <td className="px-3 py-3 text-[var(--muted-foreground)]">
                                    {(meta.from ?? 0) + index}
                                </td>
                                <td className="px-3 py-3">
                                    <div className="font-semibold text-[var(--foreground)]">
                                        {section.grade_level?.name ??
                                            'No grade level'}{' '}
                                        - {section.name}
                                    </div>
                                    <div className="text-[11px] text-[var(--muted-foreground)]">
                                        {section.school_year}
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    {section.adviser ? (
                                        <>
                                            <div className="font-medium text-[var(--foreground)]">
                                                {section.adviser.full_name}
                                            </div>
                                            <div className="text-[11px] text-[var(--muted-foreground)]">
                                                {section.adviser.email ??
                                                    section.adviser.phone ??
                                                    'No contact'}
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-[var(--muted-foreground)]">
                                            No adviser
                                        </span>
                                    )}
                                </td>
                                <td className="px-3 py-3 font-medium text-[var(--foreground)]">
                                    {section.schedule?.time_in_display ?? '-'}
                                </td>
                                <td className="px-3 py-3 font-medium text-[var(--foreground)]">
                                    {section.schedule?.time_out_display ?? '-'}
                                </td>
                                <td className="px-3 py-3">
                                    <span className="inline-flex rounded-full bg-[var(--muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
                                        {section.students_count} enrolled
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onSchedule(section)}
                                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 text-xs font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
                                    >
                                        <Pencil size={14} />
                                        {section.schedule ? 'Edit' : 'Set'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
