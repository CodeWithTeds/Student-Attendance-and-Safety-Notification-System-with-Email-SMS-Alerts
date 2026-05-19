import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock3, LogIn, LogOut, QrCode, ScanLine, ShieldCheck, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ScanModeControl } from '@/features/qr-scanner/components/ScanModeControl';
import { ScannerViewport } from '@/features/qr-scanner/components/ScannerViewport';
import { ScanResultPanel } from '@/features/qr-scanner/components/ScanResultPanel';
import { useQrScanner } from '@/features/qr-scanner/hooks/useQrScanner';
import { recordQrAttendance } from '@/features/qr-scanner/services/qrAttendanceApi';
import type { AttendanceEventType, AttendanceLogResource } from '@/features/qr-scanner/types';

type ScanMode = AttendanceEventType | 'auto';
type ScanToastType = 'success' | 'warning' | 'error';

type ScanToast = {
    id: number;
    type: ScanToastType;
    title: string;
    message: string;
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

export default function StudentQrScanner() {
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
                showToast(
                    attendanceLog.schedule_status === 'Late' ? 'warning' : 'success',
                    attendanceLog.schedule_status === 'Late' ? 'Late time in recorded' : `${attendanceLog.status_label} recorded`,
                    `${attendanceLog.student.name} was marked ${attendanceLog.status_label.toLowerCase()} at ${attendanceLog.scanned_at_display}. Parent notifications were queued when enabled.`,
                );
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

            <div className="flex h-full flex-1 flex-col gap-6 bg-neutral-50/60 p-6 dark:bg-black/20">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                            <ScanLine className="h-4 w-4" />
                            Student attendance
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Attendance QR Scan</h1>
                        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
                            Scan an approved student QR code and record Time In or Time Out using the same validation as the public attendance scanner.
                        </p>
                    </div>

                    <div className="rounded-xl border bg-background p-4 shadow-sm">
                        <p className="mb-3 text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">Scan mode</p>
                        <ScanModeControl value={scanMode} onChange={setScanMode} />
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
                    <div className="space-y-4">
                        <ScannerViewport
                            videoRef={scanner.videoRef}
                            canvasRef={scanner.canvasRef}
                            isScanning={scanner.isScanning}
                            message={scanner.message}
                            onStart={scanner.start}
                            onStop={scanner.stop}
                        />

                        <div className="grid gap-3 md:grid-cols-3">
                            <InfoPill icon={LogIn} label="Time In" text="Records arrival and marks late when past the section schedule." />
                            <InfoPill icon={LogOut} label="Time Out" text="Allowed only after the student has an active Time In today." />
                            <InfoPill icon={ShieldCheck} label="Validation" text="Duplicate scans and invalid QR codes are blocked before saving." />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <ScanResultPanel result={result} error={error} isProcessing={isProcessing} />
                        <div className="rounded-2xl border bg-background p-5 shadow-sm">
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
