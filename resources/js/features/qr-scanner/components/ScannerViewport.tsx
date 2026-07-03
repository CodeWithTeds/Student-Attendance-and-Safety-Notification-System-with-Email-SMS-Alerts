import { Camera, CameraOff, Loader2, QrCode, ScanLine } from 'lucide-react';
import type { RefObject } from 'react';

interface ScannerViewportProps {
    videoRef: RefObject<HTMLVideoElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    isScanning: boolean;
    message: string;
    onStart: () => void;
    onStop: () => void;
}

export function ScannerViewport({
    videoRef,
    canvasRef,
    isScanning,
    message,
    onStart,
    onStop,
}: ScannerViewportProps) {
    return (
        <section className="overflow-hidden rounded-2xl bg-[#1D1D1F] text-white shadow-[0_40px_90px_-35px_rgba(0,0,0,0.65)] sm:rounded-[2rem]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF3B30] shadow-lg shadow-[#FF3B30]/30 sm:h-10 sm:w-10 sm:rounded-2xl">
                        <ScanLine size={16} className="sm:hidden" />
                        <ScanLine size={20} className="hidden sm:block" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-[0.12em] text-white/35 uppercase sm:text-xs">
                            Scanner
                        </p>
                        <h2 className="text-base font-black tracking-tight sm:text-lg">
                            Student QR Camera
                        </h2>
                    </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
                    <span
                        className={`h-2 w-2 rounded-full ${isScanning ? 'animate-pulse bg-[#4CD964]' : 'bg-white/35'}`}
                    />
                    {isScanning ? 'Live' : 'Idle'}
                </span>
            </div>

            <div className="relative aspect-[3/4] bg-black sm:aspect-video">
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1D1D1F] px-6 text-center sm:px-8">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#FF3B30] sm:mb-5 sm:h-20 sm:w-20 sm:rounded-[1.75rem]">
                            <QrCode size={32} className="sm:hidden" />
                            <QrCode size={42} className="hidden sm:block" />
                        </div>
                        <p className="max-w-xs text-lg font-black tracking-tight sm:max-w-sm sm:text-xl">
                            Open the camera and place the student QR inside the frame.
                        </p>
                    </div>
                )}

                {isScanning && (
                    <div className="pointer-events-none absolute inset-5 rounded-2xl border-2 border-white/80 shadow-[0_0_0_999px_rgba(0,0,0,0.2)] sm:inset-8 sm:rounded-[1.5rem]">
                        <div className="absolute top-1/2 left-3 h-0.5 w-[calc(100%-1.5rem)] -translate-y-1/2 animate-pulse bg-[#FF3B30] sm:left-4 sm:w-[calc(100%-2rem)]" />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 px-4 py-4 sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4 sm:px-6 sm:py-5">
                <p className="flex min-h-5 items-center gap-2 text-xs font-bold text-white/60 sm:min-h-6 sm:text-sm">
                    {isScanning && <Loader2 size={14} className="animate-spin sm:size-[16px]" />}
                    {message}
                </p>
                <button
                    type="button"
                    onClick={isScanning ? onStop : onStart}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF3B30] px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-[#FF3B30]/25 transition-all hover:scale-105 active:scale-95 sm:w-auto sm:rounded-2xl sm:px-6 sm:py-3"
                >
                    {isScanning ? <CameraOff size={18} /> : <Camera size={18} />}
                    {isScanning ? 'Stop Camera' : 'Start Camera'}
                </button>
            </div>
        </section>
    );
}
