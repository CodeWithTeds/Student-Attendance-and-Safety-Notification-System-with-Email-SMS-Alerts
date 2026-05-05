import { Keyboard, Send } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface ManualQrEntryProps {
    onSubmit: (value: string) => void;
    disabled: boolean;
}

export function ManualQrEntry({ onSubmit, disabled }: ManualQrEntryProps) {
    const [value, setValue] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const qrCodeValue = value.trim();

        if (!qrCodeValue) {
            return;
        }

        onSubmit(qrCodeValue);
        setValue('');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#1D1D1F]/5 sm:p-6"
        >
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5F5F7] text-[#FF3B30]">
                    <Keyboard size={20} />
                </div>
                <div>
                    <p className="text-xs font-black tracking-[0.12em] text-[#FF3B30] uppercase">
                        Fallback
                    </p>
                    <h2 className="text-lg font-black tracking-tight">
                        Manual QR Entry
                    </h2>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                    type="text"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="Paste or type the SASN QR payload"
                    className="min-h-12 rounded-2xl border border-[#1D1D1F]/10 bg-[#F5F5F7] px-4 text-sm font-bold text-[#1D1D1F] outline-none transition focus:border-[#FF3B30] focus:bg-white"
                    disabled={disabled}
                />
                <button
                    type="submit"
                    disabled={disabled || value.trim().length === 0}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#1D1D1F] px-5 text-sm font-black text-white transition-all hover:scale-105 hover:bg-[#FF3B30] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                    <Send size={16} />
                    Record
                </button>
            </div>
        </form>
    );
}
