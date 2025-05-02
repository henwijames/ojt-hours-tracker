import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { GraduationCap, LayoutGrid, Megaphone, School, Users } from 'lucide-react';
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
    ];

    const studentNav: NavItem[] = [
        { title: 'Dashboard', href: '/student/dashboard', icon: LayoutGrid },
        { title: 'My OJT Hours', href: '/student/ojt-hours', icon: GraduationCap },
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
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
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
