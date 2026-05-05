import { Activity, LogIn, LogOut, ShieldCheck } from 'lucide-react';

interface ScannerSummaryProps {
    successfulScans: number;
    latestAction: string;
}

export function ScannerSummary({ successfulScans, latestAction }: ScannerSummaryProps) {
    const items = [
        {
            icon: Activity,
            label: 'Session scans',
            value: successfulScans.toString(),
        },
        {
            icon: ShieldCheck,
            label: 'Mode',
            value: 'Public',
        },
        {
            icon: latestAction === 'Check-out' ? LogOut : LogIn,
            label: 'Latest action',
            value: latestAction,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {items.map((item) => (
                <div
                    key={item.label}
                    className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-[#1D1D1F]/5"
                >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F7] text-[#FF3B30]">
                        <item.icon size={20} />
                    </div>
                    <p className="text-xs font-black tracking-[0.12em] text-[#1D1D1F]/35 uppercase">
                        {item.label}
                    </p>
                    <p className="mt-1 text-2xl font-black tracking-tight text-[#1D1D1F]">
                        {item.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
