import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { StatCard } from '@/components/dashboard/StatCard';
import { Users, BookOpen, UserCog, Layers, Activity, CheckCircle, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardProps {
    stats: {
        total_students: number;
        total_parents: number;
        total_advisers: number;
        total_sections: number;
        total_attendance_today: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6 bg-neutral-50/50 dark:bg-black/20">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                        Analytics Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Overview of your school's key metrics and activities.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <StatCard
                        title="Total Students"
                        value={stats?.total_students || 0}
                        icon={BookOpen}
                        description="Enrolled in the system"
                        colorFrom="from-blue-500/20"
                        colorTo="to-indigo-500/20"
                        iconColor="text-blue-600 dark:text-blue-400"
                    />
                    <StatCard
                        title="Total Guardians"
                        value={stats?.total_parents || 0}
                        icon={Users}
                        description="Registered parents"
                        colorFrom="from-violet-500/20"
                        colorTo="to-fuchsia-500/20"
                        iconColor="text-violet-600 dark:text-violet-400"
                    />
                    <StatCard
                        title="Total Advisers"
                        value={stats?.total_advisers || 0}
                        icon={UserCog}
                        description="Active teachers"
                        colorFrom="from-amber-500/20"
                        colorTo="to-orange-500/20"
                        iconColor="text-amber-600 dark:text-amber-400"
                    />
                    <StatCard
                        title="Class Sections"
                        value={stats?.total_sections || 0}
                        icon={Layers}
                        description="Created sections"
                        colorFrom="from-pink-500/20"
                        colorTo="to-rose-500/20"
                        iconColor="text-pink-600 dark:text-pink-400"
                    />
                    <StatCard
                        title="Attendance Today"
                        value={stats?.total_attendance_today || 0}
                        icon={Activity}
                        description="Records logged today"
                        trend="up"
                        trendValue="Active"
                        colorFrom="from-emerald-500/20"
                        colorTo="to-teal-500/20"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 border-none shadow-lg dark:bg-black/40 dark:backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Activity Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center min-h-[300px]">
                            <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                                <Activity className="h-12 w-12 text-primary animate-pulse" />
                                <p className="text-muted-foreground text-sm text-center">
                                    Detailed charting and analytics will appear here.<br/>
                                    System metrics are functioning normally.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3 border-none shadow-lg dark:bg-black/40 dark:backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Recent Highlights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center shadow-inner">
                                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold leading-none">New Student Enrolled</p>
                                    <p className="text-xs text-muted-foreground">The student registration portal is active.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shadow-inner">
                                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold leading-none">Daily Attendance</p>
                                    <p className="text-xs text-muted-foreground">{stats?.total_attendance_today || 0} attendance records captured today.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center shadow-inner">
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
