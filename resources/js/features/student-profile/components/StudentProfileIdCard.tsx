import { QrCode } from 'lucide-react';
import type { StudentProfile } from '../types';

interface Props {
    student: StudentProfile;
}

export default function StudentProfileIdCard({ student }: Props) {
    const joinedAt = formatDate(student.created_at);

    return (
        <div className="relative flex h-[500px] w-[320px] flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl print:border print:border-slate-100 print:shadow-none">
            <div className="relative flex h-[180px] flex-col items-center bg-white pt-8">
                <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full bg-blue-900" />
                <div className="absolute top-5 -left-2 h-[60px] w-[30px] rounded-r-full bg-blue-900" />

                <div className="mb-1 text-[14px] font-extrabold tracking-[2px] text-blue-900">SASN</div>
                <div className="text-lg font-black text-blue-900 uppercase">STUDENT ID</div>

                <div className="absolute top-[110px] left-1/2 z-10 flex h-[180px] w-[180px] -translate-x-1/2 items-center justify-center rounded-[15px] border-4 border-blue-900 bg-white p-2.5 shadow-lg">
                    {student.qr_code_svg ? (
                        <div
                            className="flex h-full w-full items-center justify-center [&_svg]:h-full [&_svg]:w-full"
                            dangerouslySetInnerHTML={{ __html: student.qr_code_svg }}
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-slate-50 text-center text-slate-400">
                            <QrCode size={42} />
                            <span className="mt-2 text-xs font-black">No QR</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative flex flex-1 flex-col items-center justify-end bg-blue-900 px-7 pb-10 text-center text-white">
                <div className="absolute bottom-20 -left-8 h-24 w-24 rounded-full border-[15px] border-white/10" />

                <h2 className="mb-1 line-clamp-2 text-[22px] font-bold leading-tight tracking-tight uppercase">{student.name}</h2>
                <p className="mb-5 text-sm font-light opacity-80">Student</p>

                <div className="w-full space-y-1.5 text-[12px]">
                    <IdLine label="ID" value={student.student_number || 'PENDING'} />
                    <IdLine label="Email" value={student.email} />
                    <IdLine label="Join Date" value={joinedAt} />
                </div>

                <div className="absolute bottom-4 flex w-full justify-center gap-1 opacity-30">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <span key={index} className="h-1 w-1 rounded-full bg-white" />
                    ))}
                </div>
            </div>
        </div>
    );
}

function IdLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-center gap-1.5">
            <span className="text-white/55">{label}:</span>
            <span className="truncate font-bold">{value}</span>
        </div>
    );
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
}
