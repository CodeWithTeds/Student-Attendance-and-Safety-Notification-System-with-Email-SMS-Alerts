import { User } from '../types';
import { AlertCircle, CheckCircle2, Download, LoaderCircle, LogIn, LogOut, RefreshCcw, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { recordQrAttendance } from '@/features/qr-scanner/services/qrAttendanceApi';
import type { AttendanceEventType, AttendanceLogResource } from '@/features/qr-scanner/types';

interface Props {
    student: User;
    onClose: () => void;
}

type AttendanceAction = AttendanceEventType | 'auto';
type AttendanceToastType = 'success' | 'warning' | 'error';

type AttendanceToast = {
    id: number;
    type: AttendanceToastType;
    title: string;
    message: string;
};

const attendanceActions = [
    { value: 'auto', label: 'Auto', icon: RefreshCcw },
    { value: 'check_in', label: 'Time In', icon: LogIn },
    { value: 'check_out', label: 'Time Out', icon: LogOut },
] as const;

const toastStyles: Record<AttendanceToastType, string> = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    warning: 'border-amber-200 bg-amber-50 text-amber-950',
    error: 'border-red-200 bg-red-50 text-red-950',
};

const toastIconStyles: Record<AttendanceToastType, string> = {
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
};

export default function StudentIdCard({ student, onClose }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [latestAttendance, setLatestAttendance] = useState<AttendanceLogResource | null>(null);
    const [toast, setToast] = useState<AttendanceToast | null>(null);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });

    const showToast = useCallback((type: AttendanceToastType, title: string, message: string) => {
        setToast({
            id: Date.now(),
            type,
            title,
            message,
        });
    }, []);

    const recordAttendance = async (eventType: AttendanceAction) => {
        if (isProcessing) {
            return;
        }

        if (!student.qr_code_value) {
            showToast('error', 'QR code required', 'Generate this student QR code before recording attendance.');

            return;
        }

        setIsProcessing(true);

        try {
            const attendanceLog = await recordQrAttendance({
                qrCodeValue: student.qr_code_value,
                eventType,
            });

            setLatestAttendance(attendanceLog);
            showAttendanceToast(attendanceLog, showToast);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to record this attendance scan.';
            showToast('error', 'Attendance validation failed', message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm print:bg-white print:p-0 print:static">
            {toast && <AttendanceToastItem toast={toast} onDismiss={() => setToast(null)} />}
            <div className="flex w-full max-w-[1080px] max-h-[86vh] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl print:border-none print:shadow-none print:w-auto print:max-h-none">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 print:hidden">
                    <div>
                        <h2 className="text-lg font-bold text-[var(--foreground)]">Student ID Card</h2>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            {student.name} {student.student_number ? `- ${student.student_number}` : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Modal Body / ID Card Container */}
                <div className="grid gap-6 bg-[var(--secondary)]/30 p-8 overflow-auto print:block print:bg-white print:p-0 lg:grid-cols-[360px_1fr]">
                    <div className="relative flex h-[500px] w-[320px] flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl print:border print:border-slate-100 print:shadow-none">
                        {/* ID Top Section */}
                        <div className="relative flex h-[180px] flex-col items-center pt-8 bg-white">
                            {/* Decorative Shapes */}
                            <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full bg-blue-900" />
                            <div className="absolute top-5 -left-2 h-[60px] w-[30px] rounded-r-full bg-blue-900" />
                            
                            <div className="mb-1 text-[14px] font-extrabold tracking-[2px] text-blue-900">SASN</div>
                            <div className="text-lg font-black uppercase text-blue-900">STUDENT ID</div>

                            {/* QR Code Wrapper */}
                            <div className="absolute top-[110px] left-1/2 z-10 flex h-[180px] w-[180px] -translate-x-1/2 items-center justify-center rounded-[15px] border-4 border-blue-900 bg-white p-2.5 shadow-lg">
                                <div 
                                    className="h-full w-full flex items-center justify-center"
                                    dangerouslySetInnerHTML={{ __html: student.qr_code_svg ?? '' }} 
                                />
                            </div>
                        </div>

                        {/* ID Bottom Section */}
                        <div className="relative flex flex-1 flex-col items-center justify-end bg-blue-900 pb-10 text-center text-white">
                            {/* Decorative Arc */}
                            <div className="absolute bottom-20 -left-8 h-24 w-24 rounded-full border-[15px] border-white/10" />
                            
                            <div className="mb-1 text-[22px] font-bold tracking-tight uppercase">{student.name}</div>
                            <div className="mb-5 text-sm font-light opacity-80">Student</div>

                            <div className="mb-1 text-[12px]">
                                <span className="mr-1 opacity-70">ID:</span>
                                <span className="font-semibold">{student.student_number || 'PENDING'}</span>
                            </div>
                            <div className="mb-1 text-[12px]">
                                <span className="mr-1 opacity-70">Email:</span>
                                <span className="font-semibold">{student.email}</span>
                            </div>
                            <div className="mt-2 text-[12px]">
                                <span className="mr-1 opacity-70">Join Date:</span>
                                <span className="font-semibold">{formatDate(student.created_at)}</span>
                            </div>

                            {/* Dot Matrix Decoration */}
                            <div className="absolute bottom-4 flex w-full justify-center gap-1 opacity-30">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="h-1 w-1 rounded-full bg-white" />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 print:hidden">
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm">
                            <p className="text-xs font-bold tracking-[0.12em] text-[var(--muted-foreground)] uppercase">Attendance QR Scan</p>
                            <h3 className="mt-2 text-xl font-black text-[var(--foreground)]">Record Time In / Time Out</h3>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--muted-foreground)]">
                                Uses the same validation as the public attendance scanner. It blocks duplicate Time In, prevents Time Out without an active Time In, marks late arrivals, and queues parent notifications when enabled.
                            </p>

                            <div className="mt-5 grid gap-2 sm:grid-cols-3">
                                {attendanceActions.map((action) => (
                                    <button
                                        key={action.value}
                                        type="button"
                                        onClick={() => recordAttendance(action.value)}
                                        disabled={isProcessing || !student.qr_code_value}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-black text-[var(--foreground)] shadow-sm transition hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <action.icon size={16} />
                                        {action.label}
                                    </button>
                                ))}
                            </div>

                            {!student.qr_code_value && (
                                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                                    QR code is not generated for this student yet.
                                </p>
                            )}

                            {isProcessing && (
                                <p className="mt-4 flex items-center gap-2 text-xs font-black tracking-[0.12em] text-[var(--muted-foreground)] uppercase">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Recording attendance...
                                </p>
                            )}
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm">
                            <p className="text-xs font-bold tracking-[0.12em] text-[var(--muted-foreground)] uppercase">Latest Result</p>
                            {latestAttendance ? (
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                            latestAttendance.schedule_status === 'Late'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {latestAttendance.event_type === 'check_in' ? <LogIn size={20} /> : <LogOut size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-[var(--foreground)]">{latestAttendance.status_label}</h4>
                                            <p className="text-sm font-semibold text-[var(--muted-foreground)]">{latestAttendance.scanned_at_display}</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-2 text-sm">
                                        <div className="flex items-center justify-between rounded-xl bg-[var(--secondary)] px-3 py-2">
                                            <span className="font-semibold text-[var(--muted-foreground)]">Status</span>
                                            <span className={`font-black ${
                                                latestAttendance.schedule_status === 'Late' ? 'text-amber-700' : 'text-emerald-700'
                                            }`}>
                                                {latestAttendance.schedule_status ?? 'Recorded'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-xl bg-[var(--secondary)] px-3 py-2">
                                            <span className="font-semibold text-[var(--muted-foreground)]">Student</span>
                                            <span className="font-black text-[var(--foreground)]">{latestAttendance.student.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-xl bg-[var(--secondary)] px-3 py-2">
                                            <span className="font-semibold text-[var(--muted-foreground)]">Schedule</span>
                                            <span className="font-black text-[var(--foreground)]">
                                                {latestAttendance.schedule ? `${latestAttendance.schedule.time_in_display} - ${latestAttendance.schedule.time_out_display}` : 'No schedule'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--muted-foreground)]">
                                    Choose Auto, Time In, or Time Out to record attendance from this student QR code.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] p-4 print:hidden">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                    >
                        <Download size={14} /> Print ID
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function showAttendanceToast(attendanceLog: AttendanceLogResource, showToast: (type: AttendanceToastType, title: string, message: string) => void) {
    if (attendanceLog.schedule_status === 'Late') {
        const scheduleText = attendanceLog.schedule ? ` Scheduled Time In was ${attendanceLog.schedule.time_in_display}.` : '';

        showToast(
            'warning',
            'Late time in recorded',
            `${attendanceLog.student.name} was marked late at ${attendanceLog.scanned_at_display}.${scheduleText} Parent notifications were queued when enabled.`,
        );

        return;
    }

    showToast(
        'success',
        `${attendanceLog.status_label} recorded`,
        `${attendanceLog.student.name} was marked ${attendanceLog.status_label.toLowerCase()} at ${attendanceLog.scanned_at_display}. Parent notifications were queued when enabled.`,
    );
}

function AttendanceToastItem({ toast, onDismiss }: { toast: AttendanceToast; onDismiss: () => void }) {
    useEffect(() => {
        const timeout = window.setTimeout(onDismiss, 4200);

        return () => window.clearTimeout(timeout);
    }, [toast.id, onDismiss]);

    const Icon = toast.type === 'success' ? CheckCircle2 : AlertCircle;

    return (
        <div className="pointer-events-none fixed top-5 right-5 z-[80] flex w-[calc(100%-2.5rem)] justify-end sm:w-auto print:hidden">
            <div
                className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl ${toastStyles[toast.type]}`}
                role="status"
                aria-live="polite"
            >
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${toastIconStyles[toast.type]}`} />
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-black">{toast.title}</p>
                    <p className="mt-1 text-sm font-semibold opacity-75">{toast.message}</p>
                </div>
                <button
                    type="button"
                    className="rounded-lg p-1 opacity-70 transition hover:opacity-100"
                    onClick={onDismiss}
                    aria-label="Dismiss notification"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
