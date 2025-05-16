import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Book, Building, Clock, GraduationCap, LayoutGrid, Megaphone, School, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props as unknown as {
        auth: {
            user: {
                role: 'admin' | 'coordinator' | 'student';
            };
        };
    };

    const role = auth.user.role;

    const adminNav: NavItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
        { title: 'Departments', href: '/admin/departments', icon: School },
        { title: 'Programs', href: '/admin/programs', icon: GraduationCap },
        { title: 'Users', href: '/admin/users', icon: Users },
    ];

    const coordinatorNav: NavItem[] = [
        { title: 'Dashboard', href: '/coordinator/dashboard', icon: LayoutGrid },
        { title: 'Students', href: '/coordinator/students', icon: GraduationCap },
        { title: 'Announcements', href: '/coordinator/announcements', icon: Megaphone },
        { title: 'Company Submissions', href: '/coordinator/company-submissions', icon: Building },
    ];

    const studentNav: NavItem[] = [
        { title: 'Dashboard', href: '/student/dashboard', icon: LayoutGrid },
        { title: 'Time Record', href: '/student/time-records', icon: Clock },
        { title: 'Company', href: '/student/company/', icon: Building },
        { title: 'Announcements', href: '/student/announcements', icon: Megaphone },
        { title: 'Reminders', href: '/student/reminders', icon: Bell },
        { title: 'OJT Journals', href: '/student/journals', icon: Book },
    ];

    let mainNavItems: NavItem[] = [];

    if (role === 'admin') mainNavItems = adminNav;
    else if (role === 'coordinator') mainNavItems = coordinatorNav;
    else if (role === 'student') mainNavItems = studentNav;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {role === 'student' ? (
                                <Link href="/student/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            ) : role === 'coordinator' ? (
                                <Link href="/coordinator/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            ) : (
                                <Link href="/admin/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
