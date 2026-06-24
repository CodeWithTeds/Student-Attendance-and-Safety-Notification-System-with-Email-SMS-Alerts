import { useCallback, useEffect, useRef, useState } from 'react';
import { BarcodeDetector as BarcodeDetectorPolyfill } from 'barcode-detector';

interface BarcodeDetectorResult {
    rawValue: string;
}

interface BarcodeDetectorConstructor {
    new (options?: { formats: string[] }): {
        detect: (source: CanvasImageSource) => Promise<BarcodeDetectorResult[]>;
    };
}

type BarcodeDetectorInstance = InstanceType<BarcodeDetectorConstructor>;

declare global {
    interface Window {
        BarcodeDetector?: BarcodeDetectorConstructor;
    }
}

/**
 * Returns the native BarcodeDetector if available, otherwise falls back to the
 * polyfill so QR scanning works on Windows Chrome/Edge and other unsupported browsers.
 */
function getBarcodeDetector(): BarcodeDetectorConstructor {
    if (window.BarcodeDetector) {
        return window.BarcodeDetector;
    }

    return BarcodeDetectorPolyfill as unknown as BarcodeDetectorConstructor;
}

type ScannerStatus = 'idle' | 'starting' | 'scanning' | 'unsupported' | 'error';

interface UseQrScannerOptions {
    onScan: (value: string) => void;
}

export function useQrScanner({ onScan }: UseQrScannerOptions) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const frameRef = useRef<number | null>(null);
    const lastScanRef = useRef<{ value: string; scannedAt: number } | null>(null);
    const onScanRef = useRef(onScan);
    const [status, setStatus] = useState<ScannerStatus>('idle');
    const [message, setMessage] = useState('Camera is ready when you are.');

    useEffect(() => {
        onScanRef.current = onScan;
    }, [onScan]);

    const stop = useCallback(() => {
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setStatus('idle');
        setMessage('Camera is paused.');
    }, []);

    const runDetectionLoop = useCallback((detector: BarcodeDetectorInstance) => {
        async function scanFrame() {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');

            if (!video || !canvas || !context || video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
                frameRef.current = requestAnimationFrame(scanFrame);

                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            try {
                const results = await detector.detect(canvas);
                const scannedValue = results[0]?.rawValue?.trim();

                if (scannedValue) {
                    const lastScan = lastScanRef.current;
                    const now = Date.now();
                    const shouldProcess =
                        !lastScan ||
                        lastScan.value !== scannedValue ||
                        now - lastScan.scannedAt > 3500;

                    if (shouldProcess) {
                        lastScanRef.current = { value: scannedValue, scannedAt: now };
                        onScanRef.current(scannedValue);
                    }
                }
            } catch {
                setStatus('error');
                setMessage('The camera feed could not be scanned. Restart the scanner.');

                return;
            }

            frameRef.current = requestAnimationFrame(scanFrame);
        }

        frameRef.current = requestAnimationFrame(scanFrame);
    }, []);

    const start = useCallback(async () => {
        setStatus('starting');
        setMessage('Requesting camera access...');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            const DetectorClass = getBarcodeDetector();
            const detector = new DetectorClass({ formats: ['qr_code'] });

            setStatus('scanning');
            setMessage('Scanning for a student QR code...');
            runDetectionLoop(detector);
        } catch {
            setStatus('error');
            setMessage('Camera access was blocked or unavailable. Enable camera access to scan student QR codes.');
        }
    }, [runDetectionLoop]);

    useEffect(() => stop, [stop]);

    return {
        videoRef,
        canvasRef,
        status,
        message,
        isScanning: status === 'starting' || status === 'scanning',
        start,
        stop,
    };
}
