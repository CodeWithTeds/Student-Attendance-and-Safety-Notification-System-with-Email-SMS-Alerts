import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    GraduationCap,
    HeartPulse,
    Calendar,
    CalendarClock,
    Activity,
    QrCode,
    Bell,
    Megaphone,
    BarChart3,
    Eye,
    Download,
    History,
    Settings,
    ShieldCheck,
    ClipboardList,
    ScanLine,
    UserRound,
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
        roles: ['admin', 'student'],
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
        title: 'Student Operations',
        href: '#',
        icon: ClipboardList,
        roles: ['admin'],
        items: [
            {
                title: 'Class / Section',
                href: '/admin/class-sections',
                icon: Calendar,
            },
            {
                title: 'Schedule',
                href: '/admin/schedules',
                icon: CalendarClock,
            },
            {
                title: 'Attendance',
                href: '/admin/attendance',
                icon: Activity,
            },
            {
                title: 'QR Code Management',
                href: '/admin/qr-codes',
                icon: QrCode,
            },
        ],
    },
    {
        title: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
        roles: ['admin'],
    },
    {
        title: 'Announcements',
        href: '/admin/announcements',
        icon: Megaphone,
        roles: ['admin'],
    },
    {
        title: 'Reports & Analytics',
        href: '/admin/reports',
        icon: BarChart3,
        roles: ['admin'],
    },
    {
        title: 'Absentee Monitor',
        href: '/admin/absentee-monitor',
        icon: Eye,
        roles: ['admin'],
    },
    {
        title: 'Export Management',
        href: '/admin/exports',
        icon: Download,
        roles: ['admin'],
    },
    {
        title: 'Logs / Audit Trail',
        href: '/admin/audit-trail',
        icon: History,
        roles: ['admin'],
    },
    {
        title: 'System Settings',
        href: '/admin/system-settings',
        icon: Settings,
        roles: ['admin'],
    },
];

const studentNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/student/profile',
        icon: UserRound,
        roles: ['student'],
    },
    {
        title: 'Attendance QR Scan',
        href: '/student/qr-scanner',
        icon: ScanLine,
        roles: ['student'],
    },
    {
        title: 'Attendance Records',
        href: '/student/attendance-records',
        icon: ClipboardList,
        roles: ['student'],
    },
];

const parentNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/parent/dashboard',
        icon: LayoutGrid,
        roles: ['parent'],
    },
    {
        title: 'Attendance Monitoring',
        href: '/parent/attendance-monitoring',
        icon: Activity,
        roles: ['parent'],
    },
    {
        title: 'Notifications',
        href: '/parent/notifications',
        icon: Bell,
        roles: ['parent'],
    },
    {
        title: 'Announcements',
        href: '/parent/announcements',
        icon: Megaphone,
        roles: ['parent'],
    },
];

const footerNavItems: NavItem[] = [

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
    const filteredStudentNavItems = studentNavItems.filter(
        (item) => !item.roles || item.roles.includes(userRole),
    );
    const filteredParentNavItems = parentNavItems.filter(
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
                {filteredStudentNavItems.length > 0 && (
                    <NavMain
                        items={filteredStudentNavItems}
                        label="Student"
                    />
                )}
                {filteredParentNavItems.length > 0 && (
                    <NavMain
                        items={filteredParentNavItems}
                        label="Parent / Guardian"
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
