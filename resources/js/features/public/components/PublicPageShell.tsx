import type { ReactNode } from 'react';
import { PublicFooter } from './PublicFooter';
import { PublicNavigation } from './PublicNavigation';

type PublicPage = 'home' | 'qr-scanner';

interface PublicPageShellProps {
    activePage: PublicPage;
    children: ReactNode;
}

export function PublicPageShell({ activePage, children }: PublicPageShellProps) {
    return (
        <div className="min-h-screen bg-[#F5F5F7] font-sans text-[#1D1D1F] selection:bg-[#FF3B30] selection:text-white">
            <PublicNavigation activePage={activePage} />
            {children}
            <PublicFooter />
        </div>
    );
}
