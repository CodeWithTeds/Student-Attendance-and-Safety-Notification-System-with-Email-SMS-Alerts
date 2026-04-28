import { Head, Link } from '@inertiajs/react';
import {
    Shield,
    Bell,
    QrCode,
    Mail,
    LayoutDashboard,
    Smartphone,
    CheckCircle2,
    ArrowRight,
    Play,
    Zap,
    Users,
    Activity,
    Lock,
} from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-[#F5F5F7] font-sans text-[#1D1D1F] selection:bg-[#FF3B30] selection:text-white">
            <Head title="Student Attendance & Safety System" />

            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full border-b border-[#1D1D1F]/5 bg-[#F5F5F7]/80 backdrop-blur-xl transition-all duration-300">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
                    <div className="group flex cursor-pointer items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF3B30] text-white shadow-lg shadow-[#FF3B30]/20 transition-transform group-hover:rotate-12">
                            <Shield
                                size={20}
                                fill="currentColor"
                                fillOpacity={0.2}
                            />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                            SASN
                        </span>
                    </div>
                    <div className="hidden items-center gap-10 text-[15px] font-semibold text-[#1D1D1F]/70 md:flex">
                        <a
                            href="#features"
                            className="transition-colors hover:text-[#FF3B30]"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="transition-colors hover:text-[#FF3B30]"
                        >
                            Process
                        </a>
                        <a
                            href="#preview"
                            className="transition-colors hover:text-[#FF3B30]"
                        >
                            System
                        </a>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            href={route('login')}
                            className="text-[15px] font-bold text-[#1D1D1F]/70 transition-colors hover:text-[#1D1D1F]"
                        >
                            Sign In
                        </Link>
                        <Link
                            href={route('register')}
                            className="flex items-center gap-2 rounded-full bg-[#1D1D1F] px-6 py-2.5 text-[15px] font-bold text-white shadow-xl shadow-black/10 transition-all hover:scale-105 hover:bg-[#FF3B30] active:scale-95"
                        >
                            Get Started
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* 1. HERO SECTION */}
                <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-20">
                    <div className="absolute top-0 -left-4 h-72 w-72 rounded-full bg-[#FF3B30]/10 blur-[120px]" />
                    <div className="absolute -right-4 bottom-0 h-96 w-96 rounded-full bg-[#FF3B30]/5 blur-[120px]" />

                    <div className="mx-auto w-full max-w-7xl px-8">
                        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
                            <div className="z-10 flex-1 text-center lg:text-left">
                                <div className="mb-6 flex justify-center lg:justify-start">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2 text-[13px] font-semibold tracking-wide text-white">
                                        <Zap
                                            size={14}
                                            className="animate-pulse text-[#FF3B30]"
                                        />
                                        Student Attendance & Safety System
                                    </span>
                                </div>
                                <h1 className="text-5xl leading-[1] font-[900] tracking-tight text-[#1D1D1F] sm:text-7xl lg:text-8xl">
                                    Smart Attendance.
                                    <br />
                                    <span className="bg-gradient-to-r from-[#FF3B30] to-[#FF7060] bg-clip-text text-transparent">
                                        Real-Time Safety.
                                    </span>
                                </h1>
                                <p className="mt-8 max-w-xl text-lg leading-relaxed font-medium text-[#1D1D1F]/60 lg:mx-0 lg:text-xl">
                                    A modern system that connects schools and
                                    parents through instant alerts and real-time
                                    monitoring.
                                </p>
                                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                                    <Link
                                        href={route('register')}
                                        className="group relative w-full overflow-hidden rounded-2xl bg-[#FF3B30] px-8 py-4 text-center text-lg font-extrabold text-white shadow-2xl shadow-[#FF3B30]/30 transition-all hover:scale-105 active:scale-95 sm:w-auto"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Get Started
                                            <ArrowRight
                                                size={20}
                                                strokeWidth={3}
                                            />
                                        </span>
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-500 group-hover:translate-x-full" />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative w-full max-w-[600px] flex-1 lg:max-w-none">
                                <div className="relative z-10 overflow-hidden rounded-[2.5rem] border-[10px] border-[#1D1D1F] bg-[#1D1D1F] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                                    <div className="aspect-[16/10] bg-white p-6 md:p-8">
                                        <div className="mb-8 flex items-center justify-between">
                                            <div className="space-y-2">
                                                <div className="h-5 w-32 rounded-lg bg-[#F5F5F7]" />
                                                <div className="h-3 w-20 rounded-md bg-[#F5F5F7]" />
                                            </div>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F7]">
                                                <Activity
                                                    size={20}
                                                    className="text-[#FF3B30]"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-6 grid grid-cols-3 gap-4">
                                            <div className="flex h-20 items-center justify-center rounded-2xl bg-[#F5F5F7]">
                                                <Users
                                                    size={24}
                                                    className="text-[#1D1D1F]/20"
                                                />
                                            </div>
                                            <div className="flex h-20 items-center justify-center rounded-2xl bg-[#F5F5F7]">
                                                <Bell
                                                    size={24}
                                                    className="text-[#1D1D1F]/20"
                                                />
                                            </div>
                                            <div className="flex h-20 items-center justify-center rounded-2xl bg-[#F5F5F7]">
                                                <CheckCircle2
                                                    size={24}
                                                    className="text-[#1D1D1F]/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-12 w-full animate-pulse rounded-2xl bg-[#F5F5F7]" />
                                            <div className="h-12 w-full rounded-2xl bg-[#F5F5F7]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -top-6 -right-4 z-20 w-[280px] rounded-[24px] border border-white/20 bg-white/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-transform hover:scale-105 md:w-[320px] lg:-right-10">
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF3B30] text-white shadow-lg shadow-[#FF3B30]/30">
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-black tracking-[0.1em] text-[#FF3B30] uppercase">
                                                SMS Alert
                                            </span>
                                            <p className="text-[10px] leading-none font-bold text-[#1D1D1F]/40">
                                                Just now
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-tight font-bold text-[#1D1D1F]">
                                        Student{' '}
                                        <span className="text-[#FF3B30]">
                                            John Doe
                                        </span>{' '}
                                        has entered the school at{' '}
                                        <span className="font-medium opacity-60">
                                            7:35 AM.
                                        </span>
                                    </p>
                                </div>

                                <div className="absolute -bottom-8 -left-4 z-20 flex items-center gap-5 rounded-[24px] bg-[#1D1D1F]/95 p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform hover:-translate-y-2 lg:-left-12">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF3B30] text-white shadow-[0_0_20px_rgba(255,59,48,0.4)]">
                                        <QrCode size={32} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4CD964]" />
                                            <p className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-40">
                                                Scan System Live
                                            </p>
                                        </div>
                                        <p className="text-sm font-extrabold tracking-tight">
                                            Waiting for Scan...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. FEATURES SECTION */}
                <section id="features" className="bg-white py-40">
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="mb-24 text-center lg:text-left">
                            <h2 className="text-5xl font-black tracking-tight text-[#1D1D1F] sm:text-6xl">
                                Powerful Features for <br />
                                <span className="text-[#FF3B30]">
                                    Smarter Monitoring
                                </span>
                            </h2>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: Activity,
                                    title: 'Real-time Attendance',
                                    desc: 'Monitor student activity instantly with accurate live data',
                                },
                                {
                                    icon: QrCode,
                                    title: 'QR Code Check',
                                    desc: 'Fast and secure scanning for daily attendance tracking',
                                },
                                {
                                    icon: Bell,
                                    title: 'SMS Alerts',
                                    desc: 'Immediate notifications for entry, exit, and delays',
                                },
                                {
                                    icon: Mail,
                                    title: 'Email Updates',
                                    desc: 'Structured activity reports sent directly to parents',
                                },
                                {
                                    icon: LayoutDashboard,
                                    title: 'Parent Portal',
                                    desc: 'Full visibility of student history and attendance',
                                },
                                {
                                    icon: Shield,
                                    title: 'Safety Broadcasts',
                                    desc: 'Instantly broadcast critical emergency notifications',
                                },
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="group relative overflow-hidden rounded-[2.5rem] bg-[#F5F5F7] p-10 transition-all hover:-translate-y-1 hover:bg-[#1D1D1F] hover:text-white"
                                >
                                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#1D1D1F] shadow-sm transition-all group-hover:bg-[#FF3B30] group-hover:text-white">
                                        <feature.icon
                                            size={32}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg leading-relaxed font-medium opacity-50 group-hover:opacity-70">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. HOW IT WORKS */}
                <section id="how-it-works" className="py-40">
                    <div className="mx-auto max-w-7xl px-8">
                        <h2 className="mb-32 text-center text-5xl font-black tracking-tight text-[#1D1D1F]">
                            Simple Process,{' '}
                            <span className="text-[#FF3B30]">
                                Powerful Results
                            </span>
                        </h2>
                        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: Smartphone,
                                    text: 'Student scans QR code',
                                },
                                {
                                    icon: Activity,
                                    text: 'System records attendance',
                                },
                                {
                                    icon: Bell,
                                    text: 'Parent receives SMS/Email',
                                },
                                {
                                    icon: LayoutDashboard,
                                    text: 'Admin monitors in real-time',
                                },
                            ].map((step, i) => (
                                <div
                                    key={i}
                                    className="group relative text-center lg:text-left"
                                >
                                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#1D1D1F] text-white shadow-xl transition-all group-hover:scale-110 group-hover:bg-[#FF3B30] lg:mx-0">
                                        <step.icon
                                            size={36}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <div className="mb-4 text-xs font-black tracking-widest text-[#FF3B30] uppercase">
                                        Step 0{i + 1}
                                    </div>
                                    <h3 className="text-2xl leading-tight font-extrabold tracking-tight text-[#1D1D1F]">
                                        {step.text}
                                    </h3>
                                    {i < 3 && (
                                        <div className="absolute top-10 left-[8rem] hidden h-0.5 w-[50%] bg-[#1D1D1F]/5 lg:block" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. SYSTEM PREVIEW */}
                <section
                    id="preview"
                    className="relative mx-4 mb-4 overflow-hidden rounded-[4rem] bg-[#1D1D1F] py-40 text-white"
                >
                    <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#FF3B30]/10 blur-[150px]" />
                    <div className="relative z-10 mx-auto max-w-7xl px-8">
                        <div className="flex flex-col items-center gap-20 lg:flex-row">
                            <div className="flex-1">
                                <h2 className="mb-8 text-5xl leading-tight font-black tracking-tight">
                                    Designed for <br />
                                    <span className="text-[#FF3B30]">
                                        Clarity & Control
                                    </span>
                                </h2>
                                <p className="mb-12 max-w-lg text-xl leading-relaxed font-medium opacity-60">
                                    Our interface is rebuilt for focus.
                                    Real-time graphs, instant student lookups,
                                    and one-tap emergency broadcasts.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        {
                                            icon: Activity,
                                            title: 'Live Activity Dashboard',
                                        },
                                        {
                                            icon: Shield,
                                            title: 'Emergency Broadcast System',
                                        },
                                        {
                                            icon: Users,
                                            title: 'Comprehensive Student Database',
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#FF3B30]">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="text-lg font-bold">
                                                {item.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative w-full flex-1">
                                <div className="relative rounded-[2.5rem] bg-white p-8 shadow-2xl">
                                    <div className="mb-8 flex items-center justify-between">
                                        <p className="text-xl font-extrabold text-[#1D1D1F]">
                                            Attendance Overview
                                        </p>
                                        <div className="flex gap-2">
                                            <div className="h-3 w-3 rounded-full bg-[#FF3B30]" />
                                            <div className="h-3 w-3 rounded-full bg-[#FF3B30]/20" />
                                        </div>
                                    </div>
                                    <div className="mb-6 grid grid-cols-2 gap-4">
                                        <div className="h-32 rounded-3xl bg-[#F5F5F7] p-6">
                                            <p className="mb-2 text-xs font-bold text-[#1D1D1F]/30 uppercase">
                                                Entry today
                                            </p>
                                            <p className="text-4xl font-black text-[#FF3B30]">
                                                1,240
                                            </p>
                                        </div>
                                        <div className="h-32 rounded-3xl bg-[#1D1D1F] p-6">
                                            <p className="mb-2 text-xs font-bold text-white/30 uppercase">
                                                Active now
                                            </p>
                                            <p className="text-4xl font-black text-white">
                                                98%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="h-12 rounded-2xl bg-[#F5F5F7]"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. SAFETY AND RELIABILITY (Compact) */}
                <section className="bg-[#F5F5F7] py-40">
                    <div className="mx-auto max-w-5xl px-8 text-center">
                        <h2 className="mb-20 text-5xl font-black tracking-tight text-[#1D1D1F]">
                            Trusted by{' '}
                            <span className="text-[#FF3B30]">
                                Top Institutions
                            </span>
                        </h2>
                        <div className="grid gap-12 md:grid-cols-3">
                            {[
                                {
                                    icon: Shield,
                                    title: 'Encrypted Data',
                                    desc: 'Military-grade encryption for all student and parent data.',
                                },
                                {
                                    icon: Lock,
                                    title: 'Secure Access',
                                    desc: 'Multi-factor authentication for admins and parents.',
                                },
                                {
                                    icon: Activity,
                                    title: '99.9% Uptime',
                                    desc: 'Reliable cloud infrastructure for constant monitoring.',
                                },
                            ].map((item, i) => (
                                <div key={i} className="text-left">
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1D1D1F] text-white shadow-xl">
                                        <item.icon size={28} strokeWidth={2} />
                                    </div>
                                    <h3 className="mb-3 text-xl font-extrabold text-[#1D1D1F]">
                                        {item.title}
                                    </h3>
                                    <p className="text-lg leading-relaxed font-medium opacity-50">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. FINAL CALL TO ACTION */}
                <section className="py-40">
                    <div className="mx-auto max-w-4xl px-8 text-center">
                        <div className="mb-12 inline-flex h-20 w-20 animate-bounce items-center justify-center rounded-[2rem] bg-[#FF3B30] text-white shadow-2xl shadow-[#FF3B30]/30">
                            <Shield size={40} />
                        </div>
                        <h2 className="mb-8 text-6xl font-[900] tracking-tighter text-[#1D1D1F] sm:text-7xl">
                            Start Monitoring <br />
                            <span className="text-[#FF3B30]">Smarter</span>{' '}
                            Today
                        </h2>
                        <p className="mx-auto mb-16 max-w-2xl text-2xl font-bold text-[#1D1D1F]/50">
                            Improve safety, communication, and efficiency with
                            one modern system.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                            <Link
                                href={route('register')}
                                className="group flex w-full items-center gap-3 rounded-[2rem] bg-[#1D1D1F] px-14 py-7 text-2xl font-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95 sm:w-auto"
                            >
                                Get Started
                                <ArrowRight
                                    size={24}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                            <button className="w-full rounded-[2rem] border-2 border-[#1D1D1F]/5 bg-white px-14 py-7 text-2xl font-black text-[#1D1D1F] transition-all hover:bg-[#F5F5F7] sm:w-auto">
                                Request Demo
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-[#F5F5F7] bg-white py-20">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-8 md:flex-row">
                    <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF3B30] text-white">
                            <Shield size={16} />
                        </div>
                        <span className="text-xl font-black tracking-tight">
                            SASN
                        </span>
                    </div>
                    <p className="text-sm font-bold text-[#1D1D1F]/30">
                        &copy; {new Date().getFullYear()} SASN System. Precise
                        Monitoring.
                    </p>
                    <div className="flex gap-10 text-sm font-black text-[#1D1D1F]/60">
                        <a href="#" className="hover:text-[#FF3B30]">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-[#FF3B30]">
                            Terms
                        </a>
                        <a href="#" className="hover:text-[#FF3B30]">
                            Support
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function route(name: string) {
    return `/${name.replace('.', '/')}`;
}
