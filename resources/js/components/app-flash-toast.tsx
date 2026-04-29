import { usePage } from '@inertiajs/react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SharedData } from '@/types';

type ToastType = 'success' | 'error';

type ToastState = {
    message: string;
    type: ToastType;
};

type FlashProps = SharedData & {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};

const toastStyles: Record<ToastType, string> = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    error: 'border-red-200 bg-red-50 text-red-950',
};

const iconStyles: Record<ToastType, string> = {
    success: 'text-emerald-600',
    error: 'text-red-600',
};

export function AppFlashToast() {
    const { flash } = usePage<FlashProps>().props;
    const toast = getToastFromFlash(flash);

    if (!toast) {
        return null;
    }

    return (
        <FlashToastItem key={`${toast.type}-${toast.message}`} toast={toast} />
    );
}

function FlashToastItem({ toast }: { toast: ToastState }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timeout = window.setTimeout(() => setIsVisible(false), 3800);

        return () => window.clearTimeout(timeout);
    }, []);

    if (!isVisible) {
        return null;
    }

    const Icon = toast.type === 'success' ? CheckCircle2 : XCircle;

    return (
        <div className="pointer-events-none fixed top-4 right-4 z-[70] flex w-[calc(100%-2rem)] justify-end sm:w-auto">
            <div
                className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${toastStyles[toast.type]}`}
                role="status"
                aria-live="polite"
            >
                <Icon
                    className={`mt-0.5 size-5 shrink-0 ${iconStyles[toast.type]}`}
                />
                <p className="min-w-0 flex-1 text-sm font-medium">
                    {toast.message}
                </p>
                <button
                    type="button"
                    className="rounded p-0.5 opacity-70 transition hover:opacity-100"
                    onClick={() => setIsVisible(false)}
                    aria-label="Dismiss notification"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
}

function getToastFromFlash(
    flash: FlashProps['flash'] | undefined,
): ToastState | null {
    if (flash?.success) {
        return { message: flash.success, type: 'success' };
    }

    if (flash?.error) {
        return { message: flash.error, type: 'error' };
    }

    return null;
}
