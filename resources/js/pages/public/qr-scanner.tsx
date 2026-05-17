import { Head } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, QrCode, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';
import { PublicPageShell } from '@/features/public/components/PublicPageShell';
import { ScanModeControl } from '@/features/qr-scanner/components/ScanModeControl';
import { ScannerViewport } from '@/features/qr-scanner/components/ScannerViewport';
import { ScanResultPanel } from '@/features/qr-scanner/components/ScanResultPanel';
import { useQrScanner } from '@/features/qr-scanner/hooks/useQrScanner';
import { recordQrAttendance } from '@/features/qr-scanner/services/qrAttendanceApi';
import type { AttendanceEventType, AttendanceLogResource } from '@/features/qr-scanner/types';

type ScanMode = AttendanceEventType | 'auto';

export default function QrScanner() {
    const [scanMode, setScanMode] = useState<ScanMode>('auto');
    const [result, setResult] = useState<AttendanceLogResource | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

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
            } catch (scanError) {
                setError(scanError instanceof Error ? scanError.message : 'Unable to record this scan.');
            } finally {
                setIsProcessing(false);
            }
        },
        [isProcessing, scanMode],
    );

    const scanner = useQrScanner({ onScan: recordScan });

    return (
        <PublicPageShell activePage="qr-scanner">
            <Head title="Student Attendance Scanner" />

            <main className="pt-24">
                <section className="relative overflow-hidden py-16 sm:py-20">
                    <div className="absolute top-0 -left-10 h-72 w-72 rounded-full bg-[#FF3B30]/10 blur-[120px]" />
                    <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#FF3B30]/5 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
                        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
                            <div>
                                <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2 text-[13px] font-semibold tracking-wide text-white">
                                    <Sparkles size={14} className="text-[#FF3B30]" />
                                    Student attendance scanner
                                </span>
                                <h1 className="max-w-4xl text-5xl leading-[1] font-[900] tracking-tight text-[#1D1D1F] sm:text-7xl">
                                    Scan once.
                                    <br />
                                    <span className="text-[#FF3B30]">
                                        Time in or out instantly.
                                    </span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg leading-relaxed font-medium text-[#1D1D1F]/60">
                                    Scan approved student QR codes at school entry points and record time-in or time-out attendance in real time.
                                </p>
                            </div>

                            <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#1D1D1F]/5">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF3B30] text-white shadow-lg shadow-[#FF3B30]/25">
                                        <QrCode size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black tracking-[0.12em] text-[#FF3B30] uppercase">
                                            Action
                                        </p>
                                        <h2 className="text-xl font-black tracking-tight">
                                            Scan mode
                                        </h2>
                                    </div>
                                </div>
                                <ScanModeControl value={scanMode} onChange={setScanMode} />
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                            <div className="space-y-6">
                                <ScannerViewport
                                    videoRef={scanner.videoRef}
                                    canvasRef={scanner.canvasRef}
                                    isScanning={scanner.isScanning}
                                    message={scanner.message}
                                    onStart={scanner.start}
                                    onStop={scanner.stop}
                                />
                            </div>

                            <div className="space-y-6">
                                <ScanResultPanel
                                    result={result}
                                    error={error}
                                    isProcessing={isProcessing}
                                />
                                <div className="rounded-[2rem] bg-[#1D1D1F] p-6 text-white shadow-xl">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#FF3B30]">
                                        <BadgeCheck size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight">
                                        Student QR only
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed font-bold text-white/55">
                                        Attendance is recorded only when the QR value belongs to an approved student record.
                                    </p>
                                    <div className="mt-5 flex items-center gap-2 text-sm font-black text-[#FF3B30]">
                                        Ready for attendance duty
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </PublicPageShell>
    );
}
