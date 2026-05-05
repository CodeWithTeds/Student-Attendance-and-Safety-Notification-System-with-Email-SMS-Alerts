import { Link } from '@inertiajs/react';
import { Shield } from 'lucide-react';

export function PublicFooter() {
    return (
        <footer className="border-t border-[#F5F5F7] bg-white py-20">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-8 md:flex-row">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF3B30] text-white">
                        <Shield size={16} />
                    </div>
                    <span className="text-xl font-black tracking-tight">SASN</span>
                </Link>
                <p className="text-sm font-bold text-[#1D1D1F]/30">
                    &copy; {new Date().getFullYear()} SASN System. Precise Monitoring.
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
    );
}
