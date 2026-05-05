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
    BookOpen,
    ShieldCheck,
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

// Access Management group — collapsible with 3 sub-items
const accessManagementItems: NavItem[] = [
    {
        title: 'Access Management',
        href: '#',
        icon: ShieldCheck,
        roles: ['admin'],
        items: [
            {
                title: 'User Management',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Student Management',
                href: '/admin/students',
                icon: GraduationCap,
            },
            {
                title: 'Parent / Guardian',
                href: '/admin/parents',
                icon: HeartPulse,
            },
        ],
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Class / Section',
        href: '/admin/class-sections',
        icon: Calendar,
        roles: ['admin'],
    },
    {
        title: 'Attendance',
        href: '/admin/attendance',
        icon: Activity,
        roles: ['admin'],
    },
    {
        title: 'QR Code Management',
        href: '/admin/qr-codes',
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

    const filteredMainNavItems = mainNavItems.filter(
        (item) => !item.roles || item.roles.includes(userRole),
    );
    const filteredAccessItems = accessManagementItems.filter(
        (item) => !item.roles || item.roles.includes(userRole),
    );
    const filteredAdminNavItems = adminNavItems.filter(
        (item) => !item.roles || item.roles.includes(userRole),
    );

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
                {filteredAccessItems.length > 0 && (
                    <NavMain
                        items={filteredAccessItems}
                        label="Access Management"
                    />
                )}
                {filteredAdminNavItems.length > 0 && (
                    <NavMain
                        items={filteredAdminNavItems}
                        label="Administration"
                    />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
