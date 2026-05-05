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
        <section className="overflow-hidden rounded-[2rem] bg-[#1D1D1F] text-white shadow-[0_40px_90px_-35px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF3B30] shadow-lg shadow-[#FF3B30]/30">
                        <ScanLine size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black tracking-[0.12em] text-white/35 uppercase">
                            Scanner
                        </p>
                        <h2 className="text-lg font-black tracking-tight">
                            Student QR Camera
                        </h2>
                    </div>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70">
                    <span
                        className={`h-2 w-2 rounded-full ${isScanning ? 'animate-pulse bg-[#4CD964]' : 'bg-white/35'}`}
                    />
                    {isScanning ? 'Live' : 'Idle'}
                </span>
            </div>

            <div className="relative aspect-[4/5] bg-black sm:aspect-video">
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1D1D1F] px-8 text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white/10 text-[#FF3B30]">
                            <QrCode size={42} />
                        </div>
                        <p className="max-w-sm text-xl font-black tracking-tight">
                            Open the camera and place the student QR inside the frame.
                        </p>
                    </div>
                )}

                {isScanning && (
                    <div className="pointer-events-none absolute inset-8 rounded-[1.5rem] border-2 border-white/80 shadow-[0_0_0_999px_rgba(0,0,0,0.2)]">
                        <div className="absolute top-1/2 left-4 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2 animate-pulse bg-[#FF3B30]" />
                    </div>
                )}
            </div>

            <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
                <p className="flex min-h-6 items-center gap-2 text-sm font-bold text-white/60">
                    {isScanning && <Loader2 size={16} className="animate-spin" />}
                    {message}
                </p>
                <button
                    type="button"
                    onClick={isScanning ? onStop : onStart}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#FF3B30] px-6 py-3 text-sm font-black text-white shadow-xl shadow-[#FF3B30]/25 transition-all hover:scale-105 active:scale-95"
                >
                    {isScanning ? <CameraOff size={18} /> : <Camera size={18} />}
                    {isScanning ? 'Stop Camera' : 'Start Camera'}
                </button>
            </div>
        </section>
    );
}
