import { Check, Printer, QrCode, RefreshCcw, RotateCcw, UserRound } from 'lucide-react';
import type { QrCodeMeta, QrCodeStudent } from '../types';

interface QrCodeTableProps {
    students: QrCodeStudent[];
    selected: number[];
    meta: QrCodeMeta;
    onToggleAll: () => void;
    onToggleOne: (id: number) => void;
    onGenerate: (student: QrCodeStudent) => void;
    onReset: (student: QrCodeStudent) => void;
    onView: (student: QrCodeStudent) => void;
}

export function QrCodeTable({
    students,
    selected,
    meta,
    onToggleAll,
    onToggleOne,
    onGenerate,
    onReset,
    onView,
}: QrCodeTableProps) {
    const allSelected =
        students.length > 0 && students.every((student) => selected.includes(student.id));

    return (
        <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full min-w-[980px] border-collapse">
                <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--muted)]/35 text-left">
                        <th className="w-12 px-4 py-3">
                            <button
                                type="button"
                                onClick={onToggleAll}
                                className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                                    allSelected
                                        ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                                        : 'border-[var(--border)] bg-[var(--background)]'
                                }`}
                                aria-label="Select all students"
                            >
                                {allSelected && <Check size={13} strokeWidth={3} />}
                            </button>
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Student
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Student No.
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Section
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            QR Status
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Active QR
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {students.map((student, index) => {
                        const isSelected = selected.includes(student.id);
                        const hasQrCode = Boolean(student.qr_code_svg && student.qr_code_value);
                        const section = student.current_section;

                        return (
                            <tr key={student.id} className="transition-colors hover:bg-[var(--muted)]/30">
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => onToggleOne(student.id)}
                                        className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                                            isSelected
                                                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                                                : 'border-[var(--border)] bg-[var(--background)]'
                                        }`}
                                        aria-label={`Select ${student.name}`}
                                    >
                                        {isSelected && <Check size={13} strokeWidth={3} />}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                                            <UserRound size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--foreground)]">
                                                {student.name}
                                            </p>
                                            <p className="text-xs text-[var(--muted-foreground)]">
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                                    {student.student_number ?? `Pending ${meta.from + index}`}
                                </td>
                                <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                                    {section ? `${section.grade_level?.name ?? ''} ${section.name}`.trim() : 'Not assigned'}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            hasQrCode
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}
                                    >
                                        <QrCode size={13} />
                                        {hasQrCode ? 'Generated' : 'Missing'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {hasQrCode ? (
                                        <div>
                                            <p className="font-mono text-xs font-semibold text-[var(--foreground)]">
                                                {student.qr_code_fingerprint}
                                            </p>
                                            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                                                Updated {student.qr_code_updated_at_display}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-[var(--muted-foreground)]">
                                            Generate first
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        {hasQrCode ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => onView(student)}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                                                >
                                                    <Printer size={14} />
                                                    View / Print
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onReset(student)}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                                                >
                                                    <RotateCcw size={14} />
                                                    Reset
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => onGenerate(student)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
                                            >
                                                <RefreshCcw size={14} />
                                                Generate
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {meta.total === 0 && (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                    <QrCode size={38} className="mb-3 text-[var(--muted-foreground)]" />
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                        No approved students found
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Approved student records will appear here for QR management.
                    </p>
                </div>
            )}
        </div>
    );
}
