import { LogIn, LogOut, RefreshCcw } from 'lucide-react';
import type { AttendanceEventType } from '../types';

type ScanMode = AttendanceEventType | 'auto';

interface ScanModeControlProps {
    value: ScanMode;
    onChange: (value: ScanMode) => void;
}

const modes = [
    { value: 'auto', label: 'Auto', icon: RefreshCcw },
    { value: 'check_in', label: 'Check-in', icon: LogIn },
    { value: 'check_out', label: 'Check-out', icon: LogOut },
] as const;

export function ScanModeControl({ value, onChange }: ScanModeControlProps) {
    return (
        <div className="grid rounded-2xl bg-white p-1 shadow-sm ring-1 ring-[#1D1D1F]/5 sm:grid-cols-3">
            {modes.map((mode) => (
                <button
                    key={mode.value}
                    type="button"
                    onClick={() => onChange(mode.value)}
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition-all ${
                        value === mode.value
                            ? 'bg-[#1D1D1F] text-white shadow-lg'
                            : 'text-[#1D1D1F]/55 hover:text-[#FF3B30]'
                    }`}
                >
                    <mode.icon size={16} />
                    {mode.label}
                </button>
            ))}
        </div>
    );
}
