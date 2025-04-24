import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Program {
    id: number;
    name: string;
    department: string;
    status: 'active' | 'inactive';
}
export interface Department {
    id: number;
    name: string;
    programs: Program[];
    status: 'active' | 'inactive';
}

export interface Students {
    id: number;
    student_id: string;
    name: string;
    email: string;
    department: string;
    program: string;
    status: 'active' | 'inactive';
}

export interface Coordinator {
    id: number;
    name: string;
    email: string;
    department: string;
    program: string;
    status: 'active' | 'inactive';
}
