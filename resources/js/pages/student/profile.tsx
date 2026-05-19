import { Head } from '@inertiajs/react';
import { CalendarClock, Download, GraduationCap, Mail, MapPin, Phone, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import StudentProfileIdCard from '@/features/student-profile/components/StudentProfileIdCard';
import type { StudentProfileProps } from '@/features/student-profile/types';

export default function StudentProfilePage({ student }: StudentProfileProps) {
    const section = student.current_section;
    const schedule = section?.schedule ?? null;
    const address = formatAddress(student);
    const fullName = [student.first_name, student.middle_name, student.last_name, student.suffix].filter(Boolean).join(' ') || student.name;

    return (
        <>
            <Head title="Student ID Card" />

            <div className="m-4 flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm print:m-0 print:h-auto print:border-0 print:shadow-none">
                <div className="border-b border-[var(--border)] bg-[var(--background)] p-5">
                    <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)]">Student ID Card</h1>
                    <p className="mt-1 text-sm font-semibold text-[var(--muted-foreground)]">
                        {student.name} {student.student_number ? `- ${student.student_number}` : ''}
                    </p>
                </div>

                <div className="min-h-0 flex-1 overflow-auto bg-[var(--secondary)]/30 p-8 print:block print:bg-white print:p-0">
                    <div className="flex flex-col gap-8 md:flex-row md:items-start">
                        <div className="flex shrink-0 justify-center md:w-[360px] md:justify-start">
                            <StudentProfileIdCard student={student} />
                        </div>

                        <div className="min-w-0 flex-1 space-y-3 print:hidden">
                            <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <p className="text-xs font-black tracking-[0.12em] text-[var(--muted-foreground)] uppercase">Student information</p>
                                        <h2 className="mt-1 text-xl font-black text-[var(--foreground)]">{fullName}</h2>
                                        <p className="mt-1 text-sm font-semibold text-[var(--muted-foreground)]">{student.email}</p>
                                    </div>
                                    <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                                        {student.status ?? 'student'}
                                    </span>
                                </div>

                                <div className="mt-4 grid gap-x-6 md:grid-cols-2">
                                    <InfoRow icon={UserRound} label="Student Number" value={student.student_number ?? 'No student number yet'} />
                                    <InfoRow icon={Mail} label="Email" value={student.email} />
                                    <InfoRow icon={Phone} label="Guardian Contact" value={student.guardian_phone ?? 'Not set'} />
                                    <InfoRow icon={UserRound} label="Gender" value={student.gender ?? 'Not set'} />
                                    <InfoRow icon={ShieldCheck} label="Nationality" value={student.nationality ?? 'Not set'} />
                                    <InfoRow icon={CalendarClock} label="Date of Birth" value={formatDate(student.date_of_birth)} />
                                    <InfoRow icon={MapPin} label="Address" value={address} wide />
                                </div>
                            </section>

                            <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm">
                                <p className="text-xs font-black tracking-[0.12em] text-[var(--muted-foreground)] uppercase">Class & schedule</p>
                                <div className="mt-3 grid gap-x-6 md:grid-cols-3">
                                    <InfoRow icon={GraduationCap} label="Section" value={section ? `${section.grade_level?.name ?? ''} ${section.name}`.trim() : 'Not assigned'} />
                                    <InfoRow icon={CalendarClock} label="School Year" value={section?.school_year ?? 'Not assigned'} />
                                    <InfoRow
                                        icon={CalendarClock}
                                        label="Schedule"
                                        value={schedule ? `${schedule.time_in_display} - ${schedule.time_out_display}` : 'No schedule'}
                                    />
                                </div>
                            </section>

                            <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm">
                                <p className="text-xs font-black tracking-[0.12em] text-[var(--muted-foreground)] uppercase">Parents / guardians</p>
                                <div className="mt-3 divide-y divide-[var(--border)]">
                                    {(student.parents ?? []).length > 0 ? (
                                        student.parents?.map((guardian) => (
                                            <div key={guardian.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <UsersRound size={15} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-black text-[var(--foreground)]">{guardian.name}</p>
                                                    <p className="truncate text-xs font-semibold text-[var(--muted-foreground)]">{guardian.email}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm font-semibold text-[var(--muted-foreground)]">
                                            No parent or guardian is linked yet.
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end border-t border-[var(--border)] bg-[var(--background)] p-4 print:hidden">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
                    >
                        <Download size={16} />
                        Print ID
                    </button>
                </div>
            </div>
        </>
    );
}

function InfoRow({ icon: Icon, label, value, wide = false }: { icon: LucideIcon; label: string; value: string; wide?: boolean }) {
    return (
        <div className={`flex min-w-0 items-start gap-3 border-b border-[var(--border)] py-2.5 last:border-b-0 md:last:border-b ${wide ? 'md:col-span-2' : ''}`}>
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={14} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black tracking-[0.12em] text-[var(--muted-foreground)] uppercase">{label}</p>
                <p className="mt-0.5 break-words text-sm font-bold text-[var(--foreground)]">{value}</p>
            </div>
        </div>
    );
}

function formatDate(date?: string | null): string {
    if (!date) {
        return 'Not set';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
}

function formatAddress(student: StudentProfileProps['student']): string {
    return [student.house_no, student.street, student.barangay, student.city, student.province, student.zip_code]
        .filter(Boolean)
        .join(', ') || 'Not set';
}

StudentProfilePage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Student Profile', href: '/student/profile' },
    ],
};
