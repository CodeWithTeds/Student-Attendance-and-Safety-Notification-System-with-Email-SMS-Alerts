import { AlertCircle, CalendarClock, CheckCircle2, Clock, GraduationCap, Hash } from 'lucide-react';
import type { AttendanceLogResource } from '../types';

interface ScanResultPanelProps {
    result: AttendanceLogResource | null;
    error: string | null;
    isProcessing: boolean;
}

export function ScanResultPanel({ result, error, isProcessing }: ScanResultPanelProps) {
    if (error) {
        return (
            <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#FF3B30]/15">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30]">
                    <AlertCircle size={24} />
                </div>
                <p className="mb-2 text-xs font-black tracking-[0.12em] text-[#FF3B30] uppercase">
                    Scan Failed
                </p>
                <h2 className="text-2xl font-black tracking-tight text-[#1D1D1F]">
                    QR not recorded
                </h2>
                <p className="mt-3 text-sm leading-relaxed font-bold text-[#1D1D1F]/50">
                    {error}
                </p>
            </aside>
        );
    }

    if (!result) {
        return (
            <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1D1D1F]/5">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F7] text-[#FF3B30]">
                    <Clock size={24} />
                </div>
                <p className="mb-2 text-xs font-black tracking-[0.12em] text-[#FF3B30] uppercase">
                    Waiting
                </p>
                <h2 className="text-2xl font-black tracking-tight text-[#1D1D1F]">
                    Ready for the next student
                </h2>
                <p className="mt-3 text-sm leading-relaxed font-bold text-[#1D1D1F]/50">
                    The latest successful scan will appear here with the attendance action and timestamp.
                </p>
            </aside>
        );
    }

    const resultTitle = result.schedule_status === 'Late' ? 'Late Time In' : result.status_label;

    return (
        <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1D1D1F]/5">
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
                result.schedule_status === 'Late' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-[#4CD964]/10 text-[#1F9D55]'
            }`}>
                {result.schedule_status === 'Late' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-black tracking-[0.12em] text-[#FF3B30] uppercase">
                    Recorded
                </p>
                {result.schedule_status && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full ${
                        result.schedule_status === 'Late' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-[#1F9D55]/10 text-[#1F9D55]'
                    }`}>
                        {result.schedule_status}
                    </span>
                )}
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#1D1D1F]">
                {resultTitle}
            </h2>

            <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F7] text-[#FF3B30]">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-[#1D1D1F]">
                            {result.student.name}
                        </p>
                        <p className="text-xs font-bold text-[#1D1D1F]/40">
                            {result.student.email}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F7] text-[#FF3B30]">
                        <Hash size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-[#1D1D1F]">
                            {result.student.student_number ?? 'No student number'}
                        </p>
                        <p className="text-xs font-bold text-[#1D1D1F]/40">
                            {result.scanned_at_display}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F7] text-[#FF3B30]">
                        <CalendarClock size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-[#1D1D1F]">
                            {result.schedule ? `${result.schedule.time_in_display} - ${result.schedule.time_out_display}` : 'No schedule assigned'}
                        </p>
                        <p className="text-xs font-bold text-[#1D1D1F]/40">
                            Schedule
                        </p>
                    </div>
                </div>
            </div>

            {isProcessing && (
                <p className="mt-5 text-xs font-black tracking-[0.12em] text-[#1D1D1F]/35 uppercase">
                    Saving next scan...
                </p>
            )}
        </aside>
    );
}
