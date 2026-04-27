import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Users, 
    GraduationCap, 
    HeartPulse, 
    Calendar, 
    Activity, 
    QrCode, 
    ScanLine, 
    Keyboard, 
    Bell, 
    Megaphone, 
    BarChart3, 
    Eye, 
    Download, 
    History, 
    Settings,
    FolderGit2,
    BookOpen
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, SharedData } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'User Management',
        href: '#',
        icon: Users,
        roles: ['admin'],
    },
    {
        title: 'Student Management',
        href: '#',
        icon: GraduationCap,
        roles: ['admin'],
    },
    {
        title: 'Parent / Guardian',
        href: '#',
        icon: HeartPulse,
        roles: ['admin'],
    },
    {
        title: 'Class / Section',
        href: '#',
        icon: Calendar,
        roles: ['admin'],
    },
    {
        title: 'Attendance',
        href: '#',
        icon: Activity,
        roles: ['admin'],
    },
    {
        title: 'QR Code Management',
        href: '#',
        icon: QrCode,
        roles: ['admin'],
    },
    {
        title: 'QR Scanner',
        href: '#',
        icon: ScanLine,
        roles: ['admin'],
    },
    {
        title: 'Manual Attendance',
        href: '#',
        icon: Keyboard,
        roles: ['admin'],
    },
    {
        title: 'Notifications',
        href: '#',
        icon: Bell,
        roles: ['admin'],
    },
    {
        title: 'Announcements',
        href: '#',
        icon: Megaphone,
        roles: ['admin'],
    },
    {
        title: 'Reports & Analytics',
        href: '#',
        icon: BarChart3,
        roles: ['admin'],
    },
    {
        title: 'Absentee Monitor',
        href: '#',
        icon: Eye,
        roles: ['admin'],
    },
    {
        title: 'Export Management',
        href: '#',
        icon: Download,
        roles: ['admin'],
    },
    {
        title: 'Logs / Audit Trail',
        href: '#',
        icon: History,
        roles: ['admin'],
    },
    {
        title: 'System Settings',
        href: '#',
        icon: Settings,
        roles: ['admin'],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;

    const filteredMainNavItems = mainNavItems.filter((item) => !item.roles || item.roles.includes(userRole));
    const filteredAdminNavItems = adminNavItems.filter((item) => !item.roles || item.roles.includes(userRole));
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
                {filteredAdminNavItems.length > 0 && <NavMain items={filteredAdminNavItems} label="Administration" />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
