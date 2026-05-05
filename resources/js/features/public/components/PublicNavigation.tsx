import { Link } from '@inertiajs/react';
import { ArrowRight, QrCode, Shield } from 'lucide-react';

type PublicPage = 'home' | 'qr-scanner';

interface PublicNavigationProps {
    activePage: PublicPage;
}

const navigationItems = [
    { label: 'Features', href: '/#features', page: 'home' },
    { label: 'Process', href: '/#how-it-works', page: 'home' },
    { label: 'System', href: '/#preview', page: 'home' },
    { label: 'QR Scanner', href: '/qr-scanner', page: 'qr-scanner' },
] as const;

export function PublicNavigation({ activePage }: PublicNavigationProps) {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-[#1D1D1F]/5 bg-[#F5F5F7]/80 backdrop-blur-xl transition-all duration-300">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF3B30] text-white shadow-lg shadow-[#FF3B30]/20 transition-transform group-hover:rotate-12">
                        <Shield size={20} fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                        SASN
                    </span>
                </Link>

                <div className="hidden items-center gap-8 text-[15px] font-semibold text-[#1D1D1F]/70 lg:flex">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                activePage === item.page
                                    ? 'text-[#FF3B30]'
                                    : 'transition-colors hover:text-[#FF3B30]'
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                    <Link
                        href="/login"
                        className="hidden text-[15px] font-bold text-[#1D1D1F]/70 transition-colors hover:text-[#1D1D1F] sm:inline"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/qr-scanner"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1D1D1F] shadow-sm transition-all hover:scale-105 hover:text-[#FF3B30] active:scale-95 lg:hidden"
                        aria-label="Open QR scanner"
                    >
                        <QrCode size={18} />
                    </Link>
                    <Link
                        href="/register"
                        className="flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2.5 text-[14px] font-bold text-white shadow-xl shadow-black/10 transition-all hover:scale-105 hover:bg-[#FF3B30] active:scale-95 sm:px-6 sm:text-[15px]"
                    >
                        Get Started
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
