import { forwardRef } from 'react';
import type { StudentProfile } from '../types';

interface Props {
    student: StudentProfile;
}

const cardWidth = 320;
const cardHeight = 500;

const StudentProfileIdCard = forwardRef<SVGSVGElement, Props>(
    function StudentProfileIdCard({ student }, ref) {
        const joinedAt = formatDate(student.created_at);
        const nameLines = nameToLines(student.name);
        const qrHref = student.qr_code_svg ? svgToDataUri(student.qr_code_svg) : null;

        return (
            <svg
                ref={ref}
                className="h-[500px] w-[320px] drop-shadow-2xl print:drop-shadow-none"
                width={cardWidth}
                height={cardHeight}
                viewBox={`0 0 ${cardWidth} ${cardHeight}`}
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label={`${student.name} student ID card`}
            >
                <defs>
                    <clipPath id="student-id-card-clip">
                        <rect width={cardWidth} height={cardHeight} rx="20" />
                    </clipPath>
                    <filter id="student-id-qr-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#1e3a8a" floodOpacity="0.22" />
                    </filter>
                </defs>

                <g clipPath="url(#student-id-card-clip)">
                    <rect width={cardWidth} height={cardHeight} fill="#ffffff" />
                    <circle cx="300" cy="40" r="40" fill="#1e3a8a" />
                    <circle cx="0" cy="96" r="44" fill="#1e3a8a" />

                    <text x="160" y="96" textAnchor="middle" fill="#1e3a8a" fontSize="14" fontWeight="800" letterSpacing="5">
                        SASN
                    </text>
                    <text x="160" y="126" textAnchor="middle" fill="#1e3a8a" fontSize="18" fontWeight="900">
                        STUDENT ID
                    </text>

                    <rect x="0" y="180" width={cardWidth} height="320" fill="#1e3a8a" />
                    <circle cx="16" cy="372" r="49" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="15" />

                    <rect x="74" y="110" width="172" height="172" rx="15" fill="#ffffff" stroke="#1e3a8a" strokeWidth="4" filter="url(#student-id-qr-shadow)" />
                    {qrHref ? (
                        <image href={qrHref} x="97" y="133" width="126" height="126" preserveAspectRatio="xMidYMid meet" />
                    ) : (
                        <text x="160" y="200" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800">
                            No QR
                        </text>
                    )}

                    {nameLines.map((line, index) => (
                        <text
                            key={`${line}-${index}`}
                            x="160"
                            y={index === 0 ? 313 : 342}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="22"
                            fontWeight="800"
                        >
                            {line}
                        </text>
                    ))}

                    <text x="160" y="371" textAnchor="middle" fill="#dbeafe" fontSize="14">
                        Student
                    </text>

                    <IdLine y={410} label="ID" value={student.student_number || 'PENDING'} />
                    <IdLine y={434} label="Email" value={student.email} />
                    <IdLine y={458} label="Join Date" value={joinedAt} />

                    {Array.from({ length: 10 }).map((_, index) => (
                        <circle key={index} cx={125 + index * 8} cy="482" r="2" fill="#ffffff" opacity="0.32" />
                    ))}
                </g>
            </svg>
        );
    },
);

export default StudentProfileIdCard;

function IdLine({ y, label, value }: { y: number; label: string; value: string }) {
    return (
        <text x="160" y={y} textAnchor="middle" fill="#ffffff" fontSize="12">
            <tspan fill="#bfdbfe">{label}: </tspan>
            <tspan fontWeight="800">{truncate(value, 28)}</tspan>
        </text>
    );
}

function nameToLines(name: string): string[] {
    const words = name.toUpperCase().trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return ['STUDENT'];
    }

    const first = words.shift() ?? '';
    const second = words.join(' ');

    return second ? [truncate(first, 16), truncate(second, 16)] : [truncate(first, 18)];
}

function truncate(value: string, maxLength: number): string {
    return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function svgToDataUri(svg: string): string {
    return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
}
