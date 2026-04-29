import { User } from '../types';
import { Download, X } from 'lucide-react';

interface Props {
    student: User;
    onClose: () => void;
}

export default function StudentIdCard({ student, onClose }: Props) {
    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm print:bg-white print:p-0 print:static">
            <div className="flex w-full max-w-[980px] max-h-[86vh] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl print:border-none print:shadow-none print:w-auto print:max-h-none">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 print:hidden">
                    <div>
                        <h2 className="text-lg font-bold text-[var(--foreground)]">Student ID Card</h2>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            {student.name} {student.student_number ? `- ${student.student_number}` : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Modal Body / ID Card Container */}
                <div className="flex flex-col items-center bg-[var(--secondary)]/30 p-8 overflow-auto print:bg-white print:p-0">
                    <div className="relative flex h-[500px] w-[320px] flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl print:border print:border-slate-100 print:shadow-none">
                        {/* ID Top Section */}
                        <div className="relative flex h-[180px] flex-col items-center pt-8 bg-white">
                            {/* Decorative Shapes */}
                            <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full bg-blue-900" />
                            <div className="absolute top-5 -left-2 h-[60px] w-[30px] rounded-r-full bg-blue-900" />
                            
                            <div className="mb-1 text-[14px] font-extrabold tracking-[2px] text-blue-900">SASN</div>
                            <div className="text-lg font-black uppercase text-blue-900">STUDENT ID</div>

                            {/* QR Code Wrapper */}
                            <div className="absolute top-[110px] left-1/2 z-10 flex h-[180px] w-[180px] -translate-x-1/2 items-center justify-center rounded-[15px] border-4 border-blue-900 bg-white p-2.5 shadow-lg">
                                <div 
                                    className="h-full w-full flex items-center justify-center"
                                    dangerouslySetInnerHTML={{ __html: student.qr_code_svg ?? '' }} 
                                />
                            </div>
                        </div>

                        {/* ID Bottom Section */}
                        <div className="relative flex flex-1 flex-col items-center justify-end bg-blue-900 pb-10 text-center text-white">
                            {/* Decorative Arc */}
                            <div className="absolute bottom-20 -left-8 h-24 w-24 rounded-full border-[15px] border-white/10" />
                            
                            <div className="mb-1 text-[22px] font-bold tracking-tight uppercase">{student.name}</div>
                            <div className="mb-5 text-sm font-light opacity-80">Student</div>

                            <div className="mb-1 text-[12px]">
                                <span className="mr-1 opacity-70">ID:</span>
                                <span className="font-semibold">{student.student_number || 'PENDING'}</span>
                            </div>
                            <div className="mb-1 text-[12px]">
                                <span className="mr-1 opacity-70">Email:</span>
                                <span className="font-semibold">{student.email}</span>
                            </div>
                            <div className="mt-2 text-[12px]">
                                <span className="mr-1 opacity-70">Join Date:</span>
                                <span className="font-semibold">{formatDate(student.created_at)}</span>
                            </div>

                            {/* Dot Matrix Decoration */}
                            <div className="absolute bottom-4 flex w-full justify-center gap-1 opacity-30">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="h-1 w-1 rounded-full bg-white" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] p-4 print:hidden">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                    >
                        <Download size={14} /> Print ID
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
