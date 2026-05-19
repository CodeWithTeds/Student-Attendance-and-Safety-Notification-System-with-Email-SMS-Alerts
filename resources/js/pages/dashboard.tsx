import { Head, router, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Activity, BarChart3, BookOpen, CalendarCheck, CalendarDays, CheckCircle, Clock3, Gauge, Layers, LogIn, LogOut, PieChart, ShieldAlert, TrendingUp, UserCog, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { SharedData } from '@/types';

type AttendanceTrendPoint = {
    label: string;
    check_ins: number;
    check_outs: number;
    total: number;
};

type ChartPoint = {
    label: string;
    value: number;
};

type DonutPoint = ChartPoint & {
    color?: string;
};

type SectionOccupancyPoint = ChartPoint & {
    capacity: number;
    percent: number;
};

type AttendancePeriod = 'day' | 'week' | 'month';

type StudentAttendanceChartPoint = AttendanceTrendPoint;

type StudentAttendanceRecentLog = {
    id: number;
    event_type: 'check_in' | 'check_out';
    event_label: string;
    date: string;
    time: string;
};

type StudentAttendanceSummary = {
    selected_period: AttendancePeriod;
    selected_date: string;
    max_date: string;
    range_label: string;
    options: {
        label: string;
        value: AttendancePeriod;
    }[];
    totals: {
        check_ins: number;
        check_outs: number;
        total: number;
        active_days: number;
        attendance_rate: number;
    };
    chart: StudentAttendanceChartPoint[];
    recent_logs: StudentAttendanceRecentLog[];
} | null;

interface DashboardProps {
    stats: {
        total_students: number;
        total_parents: number;
        total_advisers: number;
        total_sections: number;
        total_attendance_today: number;
        attendance_trend: AttendanceTrendPoint[];
        attendance_by_hour: ChartPoint[];
        weekly_activity: ChartPoint[];
        event_mix: DonutPoint[];
        role_distribution: DonutPoint[];
        student_status_distribution: DonutPoint[];
        grade_level_distribution: ChartPoint[];
        section_occupancy: SectionOccupancyPoint[];
        student_attendance_summary: StudentAttendanceSummary;
    };
}

const palette = ['#2563eb', '#10b981', '#f97316', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b', '#64748b'];

function chartTotal(data: ChartPoint[]): number {
    return data.reduce((sum, item) => sum + item.value, 0);
}

function shortNumber(value: number): string {
    return Intl.NumberFormat('en', { notation: value > 9999 ? 'compact' : 'standard' }).format(value);
}

function ChartPanel({
    title,
    description,
    icon: Icon,
    children,
    className = '',
}: {
    title: string;
    description: string;
    icon: LucideIcon;
    children: ReactNode;
    className?: string;
}) {
    return (
        <Card className={`border-none shadow-lg dark:bg-black/40 dark:backdrop-blur-xl ${className}`}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function EmptyChart() {
    return <div className="flex h-44 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">No chart data yet</div>;
}

function LineChart({ data }: { data: AttendanceTrendPoint[] }) {
    if (data.length === 0 || data.every((item) => item.total === 0)) {
        return <EmptyChart />;
    }

    const width = 720;
    const height = 240;
    const padding = 34;
    const maxValue = Math.max(...data.map((item) => item.total), 1);
    const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);
    const points = data.map((item, index) => {
        const x = padding + index * stepX;
        const y = height - padding - (item.total / maxValue) * (height - padding * 2);

        return { ...item, x, y };
    });
    const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padding} ${height - padding} L ${padding} ${height - padding} Z`;

    return (
        <div className="overflow-hidden">
            <svg className="h-64 w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Attendance trend line chart" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="attendanceTrendFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                    <line key={ratio} x1={padding} x2={width - padding} y1={padding + ratio * (height - padding * 2)} y2={padding + ratio * (height - padding * 2)} stroke="var(--border)" strokeDasharray="4 6" />
                ))}
                <path d={areaPath} fill="url(#attendanceTrendFill)" />
                <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                {points.map((point) => (
                    <g key={point.label}>
                        <circle cx={point.x} cy={point.y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" vectorEffect="non-scaling-stroke">
                            <title>{`${point.label}: ${point.total} scans`}</title>
                        </circle>
                        <text x={point.x} y={height - 8} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
                            {point.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

function GroupedBarChart({ data }: { data: AttendanceTrendPoint[] }) {
    if (data.length === 0 || data.every((item) => item.check_ins === 0 && item.check_outs === 0)) {
        return <EmptyChart />;
    }

    const maxValue = Math.max(...data.map((item) => Math.max(item.check_ins, item.check_outs)), 1);

    return (
        <div className="space-y-4">
            <div className="flex h-56 items-end gap-3 overflow-x-auto border-b pb-3">
                {data.map((item) => (
                    <div key={item.label} className="flex min-w-12 flex-1 flex-col items-center gap-2">
                        <div className="flex h-44 w-full items-end justify-center gap-1.5">
                            <div className="w-4 rounded-t bg-emerald-500" style={{ height: `${Math.max((item.check_ins / maxValue) * 100, item.check_ins ? 6 : 1)}%` }} title={`${item.label}: ${item.check_ins} check-ins`} />
                            <div className="w-4 rounded-t bg-orange-500" style={{ height: `${Math.max((item.check_outs / maxValue) * 100, item.check_outs ? 6 : 1)}%` }} title={`${item.label}: ${item.check_outs} check-outs`} />
                        </div>
                        <span className="text-center text-[11px] font-medium text-muted-foreground">{item.label}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Check-ins</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-orange-500" /> Check-outs</span>
            </div>
        </div>
    );
}

function VerticalBarChart({ data, color = '#2563eb' }: { data: ChartPoint[]; color?: string }) {
    if (data.length === 0 || chartTotal(data) === 0) {
        return <EmptyChart />;
    }

    const maxValue = Math.max(...data.map((item) => item.value), 1);

    return (
        <div className="flex h-56 items-end gap-3 overflow-x-auto border-b pb-3">
            {data.map((item, index) => (
                <div key={item.label} className="flex min-w-12 flex-1 flex-col items-center gap-2">
                    <div className="flex h-44 w-full items-end justify-center">
                        <div
                            className="flex w-8 items-start justify-center rounded-t text-[10px] font-bold text-white shadow-sm"
                            style={{ height: `${Math.max((item.value / maxValue) * 100, 7)}%`, backgroundColor: palette[index % palette.length] ?? color }}
                            title={`${item.label}: ${item.value}`}
                        >
                            <span className="pt-1">{item.value > 0 ? shortNumber(item.value) : ''}</span>
                        </div>
                    </div>
                    <span className="max-w-20 text-center text-[11px] font-medium text-muted-foreground">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

function DonutChart({ data }: { data: DonutPoint[] }) {
    if (data.length === 0 || chartTotal(data) === 0) {
        return <EmptyChart />;
    }

    const total = chartTotal(data);
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const segments = data.reduce<Array<DonutPoint & { dash: number; strokeDashoffset: number }>>((items, item) => {
        const previousOffset = items.reduce((sum, segment) => sum + segment.dash, 0);
        const dash = (item.value / total) * circumference;

        return [...items, { ...item, dash, strokeDashoffset: -previousOffset }];
    }, []);

    return (
        <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="relative mx-auto h-44 w-44">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="Donut chart">
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--muted)" strokeWidth="16" />
                    {segments.map((item, index) => {
                        return (
                            <circle
                                key={item.label}
                                cx="60"
                                cy="60"
                                r={radius}
                                fill="none"
                                stroke={item.color ?? palette[index % palette.length]}
                                strokeWidth="16"
                                strokeDasharray={`${item.dash} ${circumference - item.dash}`}
                                strokeDashoffset={item.strokeDashoffset}
                                strokeLinecap="round"
                            >
                                <title>{`${item.label}: ${item.value}`}</title>
                            </circle>
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold">{shortNumber(total)}</span>
                    <span className="text-xs font-medium text-muted-foreground">total</span>
                </div>
            </div>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 font-medium">
                            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color ?? palette[index % palette.length] }} />
                            {item.label}
                        </span>
                        <span className="text-muted-foreground">{Math.round((item.value / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HorizontalProgressChart({ data }: { data: SectionOccupancyPoint[] }) {
    if (data.length === 0) {
        return <EmptyChart />;
    }

    return (
        <div className="space-y-4">
            {data.map((item, index) => (
                <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="truncate font-semibold">{item.label}</span>
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">
                            {item.value}/{item.capacity}
                        </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: palette[index % palette.length] }} title={`${item.percent}% occupied`} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function StudentAttendanceStackedChart({ data }: { data: StudentAttendanceChartPoint[] }) {
    if (data.length === 0 || data.every((item) => item.total === 0)) {
        return <EmptyChart />;
    }

    const maxValue = Math.max(...data.map((item) => item.total), 1);

    return (
        <div className="space-y-4">
            <div className="flex h-64 items-end gap-3 overflow-x-auto border-b pb-4">
                {data.map((item) => {
                    const checkInHeight = item.total > 0 ? (item.check_ins / item.total) * 100 : 0;
                    const checkOutHeight = item.total > 0 ? (item.check_outs / item.total) * 100 : 0;
                    const barHeight = Math.max((item.total / maxValue) * 100, item.total ? 8 : 1);

                    return (
                        <div key={item.label} className="flex min-w-14 flex-1 flex-col items-center gap-2">
                            <div className="flex h-48 w-full items-end justify-center">
                                <div className="flex w-10 flex-col-reverse overflow-hidden rounded-t-lg bg-muted shadow-sm" style={{ height: `${barHeight}%` }} title={`${item.label}: ${item.check_ins} time in, ${item.check_outs} time out`}>
                                    <div className="bg-emerald-500" style={{ height: `${checkInHeight}%` }} />
                                    <div className="bg-orange-500" style={{ height: `${checkOutHeight}%` }} />
                                </div>
                            </div>
                            <span className="text-center text-[11px] font-semibold text-muted-foreground">{item.label}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Time in</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-orange-500" /> Time out</span>
            </div>
        </div>
    );
}

function AttendancePeriodFilter({ summary }: { summary: NonNullable<StudentAttendanceSummary> }) {
    const updateFilters = (period: AttendancePeriod, date: string) => {
        router.get('/dashboard', { attendance_period: period, attendance_date: date }, {
            only: ['stats'],
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="flex rounded-lg border bg-muted/40 p-1">
            {summary.options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => updateFilters(option.value, summary.selected_date)}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                        summary.selected_period === option.value
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

function AttendanceDateFilter({ summary }: { summary: NonNullable<StudentAttendanceSummary> }) {
    const updateDate = (date: string) => {
        if (!date) {
            return;
        }

        router.get('/dashboard', { attendance_period: summary.selected_period, attendance_date: date }, {
            only: ['stats'],
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <input
                type="date"
                value={summary.selected_date}
                max={summary.max_date}
                onChange={(event) => updateDate(event.target.value)}
                className="h-10 rounded-lg border bg-background px-3 text-sm font-semibold text-foreground shadow-sm outline-none transition focus:border-primary"
            />
        </label>
    );
}

function StudentDashboard({ stats }: DashboardProps) {
    const summary = stats.student_attendance_summary;
    const { auth } = usePage().props as SharedData;

    if (!summary) {
        return null;
    }

    return (
        <>
            <Head title="Student Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-neutral-50/50 p-6 dark:bg-black/20">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">My Attendance Dashboard</h1>
                    <p className="mt-1 font-medium text-muted-foreground">Welcome back, {auth.user.name}. Here is your attendance activity for {summary.range_label}.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Attendance Rate" value={`${summary.totals.attendance_rate}%`} icon={CalendarCheck} description="Based on active school days" trend="neutral" colorFrom="from-blue-500/20" colorTo="to-cyan-500/20" iconColor="text-blue-600 dark:text-blue-400" />
                    <StatCard title="Time In" value={summary.totals.check_ins} icon={LogIn} description="Recorded check-ins" colorFrom="from-emerald-500/20" colorTo="to-teal-500/20" iconColor="text-emerald-600 dark:text-emerald-400" />
                    <StatCard title="Time Out" value={summary.totals.check_outs} icon={LogOut} description="Recorded check-outs" colorFrom="from-orange-500/20" colorTo="to-amber-500/20" iconColor="text-orange-600 dark:text-orange-400" />
                    <StatCard title="Active Days" value={summary.totals.active_days} icon={Activity} description={`${summary.totals.total} attendance records`} colorFrom="from-violet-500/20" colorTo="to-fuchsia-500/20" iconColor="text-violet-600 dark:text-violet-400" />
                </div>

                <div className="grid gap-4 xl:grid-cols-12">
                    <Card className="border-none shadow-lg dark:bg-black/40 dark:backdrop-blur-xl xl:col-span-8">
                        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-1">
                                <CardTitle>Attendance Summary</CardTitle>
                                <CardDescription>Stacked time-in and time-out records grouped by {summary.selected_period}.</CardDescription>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <AttendanceDateFilter summary={summary} />
                                <AttendancePeriodFilter summary={summary} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <StudentAttendanceStackedChart data={summary.chart} />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg dark:bg-black/40 dark:backdrop-blur-xl xl:col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Attendance</CardTitle>
                            <CardDescription>Latest scans in the selected period.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {summary.recent_logs.length === 0 ? (
                                <div className="flex h-44 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">No attendance records yet</div>
                            ) : (
                                <div className="space-y-4">
                                    {summary.recent_logs.map((log) => (
                                        <div key={log.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${log.event_type === 'check_in' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>
                                                    {log.event_type === 'check_in' ? <LogIn className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{log.event_label}</p>
                                                    <p className="text-xs text-muted-foreground">{log.date}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold">{log.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default function Dashboard({ stats }: DashboardProps) {
    const { auth } = usePage().props as SharedData;
    const attendanceRate = stats.total_students > 0 ? Math.round((stats.total_attendance_today / stats.total_students) * 100) : 0;

    if (auth.user.role === 'student') {
        return <StudentDashboard stats={stats} />;
    }

    return (
        <>
            <Head title="Dashboard Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-neutral-50/50 p-6 dark:bg-black/20">
                <div>
                    <h1 className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-blue-400 dark:to-indigo-300">
                        Analytics Dashboard
                    </h1>
                    <p className="mt-1 font-medium text-muted-foreground">Overview of your school's key metrics and activities.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <StatCard title="Total Students" value={stats?.total_students || 0} icon={BookOpen} description="Enrolled in the system" colorFrom="from-blue-500/20" colorTo="to-indigo-500/20" iconColor="text-blue-600 dark:text-blue-400" />
                    <StatCard title="Total Guardians" value={stats?.total_parents || 0} icon={Users} description="Registered parents" colorFrom="from-violet-500/20" colorTo="to-fuchsia-500/20" iconColor="text-violet-600 dark:text-violet-400" />
                    <StatCard title="Total Advisers" value={stats?.total_advisers || 0} icon={UserCog} description="Active teachers" colorFrom="from-amber-500/20" colorTo="to-orange-500/20" iconColor="text-amber-600 dark:text-amber-400" />
                    <StatCard title="Class Sections" value={stats?.total_sections || 0} icon={Layers} description="Created sections" colorFrom="from-pink-500/20" colorTo="to-rose-500/20" iconColor="text-pink-600 dark:text-pink-400" />
                    <StatCard title="Attendance Today" value={stats?.total_attendance_today || 0} icon={Activity} description="Records logged today" trend="up" trendValue={`${attendanceRate}%`} colorFrom="from-emerald-500/20" colorTo="to-teal-500/20" iconColor="text-emerald-600 dark:text-emerald-400" />
                </div>

                <div className="grid gap-4 xl:grid-cols-12">
                    <ChartPanel title="Attendance Trend" description="Total scans across the last 14 days" icon={TrendingUp} className="xl:col-span-8">
                        <LineChart data={stats.attendance_trend ?? []} />
                    </ChartPanel>

                    <ChartPanel title="User Role Mix" description="Registered account composition" icon={PieChart} className="xl:col-span-4">
                        <DonutChart data={stats.role_distribution ?? []} />
                    </ChartPanel>

                    <ChartPanel title="Check-in vs Check-out" description="Daily attendance event comparison" icon={BarChart3} className="xl:col-span-8">
                        <GroupedBarChart data={stats.attendance_trend ?? []} />
                    </ChartPanel>

                    <ChartPanel title="Student Status" description="Approval state of student records" icon={ShieldAlert} className="xl:col-span-4">
                        <DonutChart data={stats.student_status_distribution ?? []} />
                    </ChartPanel>

                    <ChartPanel title="Today by Hour" description="Attendance scans grouped into two-hour windows" icon={Clock3} className="xl:col-span-4">
                        <VerticalBarChart data={stats.attendance_by_hour ?? []} color="#14b8a6" />
                    </ChartPanel>

                    <ChartPanel title="Weekly Activity" description="Scan volume by week" icon={CalendarDays} className="xl:col-span-4">
                        <VerticalBarChart data={stats.weekly_activity ?? []} color="#a855f7" />
                    </ChartPanel>

                    <ChartPanel title="Event Mix" description="Check-in and check-out share for the last 30 days" icon={CheckCircle} className="xl:col-span-4">
                        <DonutChart data={stats.event_mix ?? []} />
                    </ChartPanel>

                    <ChartPanel title="Students by Grade" description="Student distribution across grade levels" icon={BookOpen} className="xl:col-span-7">
                        <VerticalBarChart data={stats.grade_level_distribution ?? []} color="#f97316" />
                    </ChartPanel>

                    <ChartPanel title="Section Occupancy" description="Most populated sections against capacity" icon={Gauge} className="xl:col-span-5">
                        <HorizontalProgressChart data={stats.section_occupancy ?? []} />
                    </ChartPanel>
                </div>

                <Card className="border-none shadow-lg dark:bg-black/40 dark:backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle>Recent Highlights</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-3">
                        <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 shadow-inner">
                                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold leading-none">New Student Enrolled</p>
                                <p className="text-xs text-muted-foreground">The student registration portal is active.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 shadow-inner">
                                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold leading-none">Daily Attendance</p>
                                <p className="text-xs text-muted-foreground">{stats?.total_attendance_today || 0} attendance records captured today.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 shadow-inner">
                                <ShieldAlert className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold leading-none">System Maintenance</p>
                                <p className="text-xs text-muted-foreground">All systems are currently running smoothly.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
