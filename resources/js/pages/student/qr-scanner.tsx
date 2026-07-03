import { Head } from '@inertiajs/react';
import { AlertCircle, CalendarClock, CheckCircle2, Clock3, LogIn, LogOut, QrCode, ScanLine, ShieldCheck, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ScanModeControl } from '@/features/qr-scanner/components/ScanModeControl';
import { ScannerViewport } from '@/features/qr-scanner/components/ScannerViewport';
import { ScanResultPanel } from '@/features/qr-scanner/components/ScanResultPanel';
import { useQrScanner } from '@/features/qr-scanner/hooks/useQrScanner';
import { recordQrAttendance } from '@/features/qr-scanner/services/qrAttendanceApi';
import type { AttendanceEventType, AttendanceLogResource, AttendanceScheduleResource } from '@/features/qr-scanner/types';

type ScanMode = AttendanceEventType | 'auto';
type ScanToastType = 'success' | 'warning' | 'error';

type ScanToast = {
    id: number;
    type: ScanToastType;
    title: string;
    message: string;
};

type StudentSection = {
    id: number;
    name: string;
    school_year: string;
    grade_level?: {
        id: number;
        name: string;
    } | null;
    schedule?: AttendanceScheduleResource | null;
} | null;

type StudentQrScannerProps = {
    studentSection: StudentSection;
};

const toastStyles: Record<ScanToastType, string> = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    warning: 'border-amber-200 bg-amber-50 text-amber-950',
    error: 'border-red-200 bg-red-50 text-red-950',
};

const toastIconStyles: Record<ScanToastType, string> = {
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
};

export default function StudentQrScanner({ studentSection }: StudentQrScannerProps) {
    const [scanMode, setScanMode] = useState<ScanMode>('auto');
    const [result, setResult] = useState<AttendanceLogResource | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState<ScanToast | null>(null);

    const showToast = useCallback((type: ScanToastType, title: string, message: string) => {
        setToast({
            id: Date.now(),
            type,
            title,
            message,
        });
    }, []);

    const recordScan = useCallback(
        async (qrCodeValue: string) => {
            if (isProcessing) {
                return;
            }

            setIsProcessing(true);
            setError(null);

            try {
                const attendanceLog = await recordQrAttendance({
                    qrCodeValue,
                    eventType: scanMode,
                });

                setResult(attendanceLog);
                showAttendanceToast(attendanceLog, showToast);
            } catch (scanError) {
                const message = scanError instanceof Error ? scanError.message : 'Unable to record this scan.';

                setError(message);
                showToast('error', 'Attendance validation failed', message);
            } finally {
                setIsProcessing(false);
            }
        },
        [isProcessing, scanMode, showToast],
    );

    const scanner = useQrScanner({ onScan: recordScan });

    return (
        <>
            <Head title="Attendance QR Scan" />
            {toast && <ScanToastItem toast={toast} onDismiss={() => setToast(null)} />}

            <div className="flex h-full flex-1 flex-col gap-4 bg-neutral-50/60 p-4 dark:bg-black/20 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary sm:mb-3 sm:px-3 sm:py-1.5 sm:text-sm">
                            <ScanLine className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Student attendance
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Attendance QR Scan</h1>
                        <p className="mt-1 max-w-2xl text-xs font-medium leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                            Scan an approved student QR code and record Time In or Time Out.
                        </p>
                    </div>

                    <div className="rounded-xl border bg-background p-3 shadow-sm sm:p-4">
                        <p className="mb-2 text-[10px] font-black tracking-[0.12em] text-muted-foreground uppercase sm:mb-3 sm:text-xs">Scan mode</p>
                        <ScanModeControl value={scanMode} onChange={setScanMode} />
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
                    <div className="space-y-4">
                        <ScannerViewport
                            videoRef={scanner.videoRef}
                            canvasRef={scanner.canvasRef}
                            isScanning={scanner.isScanning}
                            message={scanner.message}
                            onStart={scanner.start}
                            onStop={scanner.stop}
                        />

                        <div className="hidden gap-3 md:grid md:grid-cols-3">
                            <InfoPill icon={LogIn} label="Time In" text="Opens 1 hour before schedule. More than 20 minutes after schedule is late." />
                            <InfoPill icon={LogOut} label="Time Out" text="Allowed only at or after the scheduled Time Out with an active Time In today." />
                            <InfoPill icon={ShieldCheck} label="Validation" text="Duplicate scans and invalid QR codes are blocked before saving." />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SchedulePanel section={studentSection} />
                        <ScanResultPanel result={result} error={error} isProcessing={isProcessing} />
                        <div className="hidden rounded-2xl border bg-background p-5 shadow-sm sm:block">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <QrCode className="h-5 w-5" />
                            </div>
                            <h2 className="text-lg font-black text-foreground">Parent notifications</h2>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                                Successful attendance scans queue guardian notifications when email or SMS notifications are enabled for the guardian account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function showAttendanceToast(attendanceLog: AttendanceLogResource, showToast: (type: ScanToastType, title: string, message: string) => void) {
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

function SchedulePanel({ section }: { section: StudentSection }) {
    const schedule = section?.schedule ?? null;
    const sectionLabel = section
        ? [section.grade_level?.name, section.name].filter(Boolean).join(' - ')
        : 'No section assigned';

    return (
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarClock className="h-5 w-5" />
            </div>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">My schedule</p>
                    <h2 className="mt-1 text-lg font-black text-foreground">{sectionLabel}</h2>
                </div>
                {section?.school_year && (
                    <span className="rounded-lg border bg-muted px-2.5 py-1 text-xs font-black text-muted-foreground">{section.school_year}</span>
                )}
            </div>

            {schedule ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <ScheduleTime label="Time In" value={schedule.time_in_display} />
                    <ScheduleTime label="Time Out" value={schedule.time_out_display} />
                </div>
            ) : (
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-relaxed text-amber-950">
                    {section ? 'No schedule is set for your section yet.' : 'Ask an admin to assign your section schedule before scanning attendance.'}
                </p>
            )}
        </div>
    );
}

function ScheduleTime({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border bg-muted/40 p-3">
            <p className="text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">{label}</p>
            <p className="mt-1 text-lg font-black text-foreground">{value}</p>
        </div>
    );
}

function InfoPill({ icon: Icon, label, text }: { icon: LucideIcon; label: string; text: string }) {
    return (
        <div className="rounded-xl border bg-background p-4 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-black text-foreground">{label}</h3>
            <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">{text}</p>
        </div>
    );
}

function ScanToastItem({ toast, onDismiss }: { toast: ScanToast; onDismiss: () => void }) {
    useEffect(() => {
        const timeout = window.setTimeout(onDismiss, 4200);

        return () => window.clearTimeout(timeout);
    }, [toast.id, onDismiss]);

    const Icon = toast.type === 'success' ? CheckCircle2 : AlertCircle;

    return (
        <div className="pointer-events-none fixed top-5 right-5 z-[80] flex w-[calc(100%-2.5rem)] justify-end sm:w-auto">
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

StudentQrScanner.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Attendance QR Scan', href: '/student/qr-scanner' },
    ],
};
