import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    isStudent: boolean;
    isCoordinator: boolean;
    isAdmin: boolean;
    student: Students;
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
    role: string;
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
    department: Department;
    program: Program;
    status: 'active' | 'inactive' | 'pending';
    student?: {
        student_id: string;
        department: Department;
        program: Program;
        status: 'active' | 'pending' | 'inactive';
    };
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        email_verified_at: string | null;
        created_at: string;
        updated_at: string;
    };
}

export interface Coordinator {
    id: number;
    name: string;
    email: string;
    department: string;
    program: Program;
    status: 'active' | 'inactive';
    coordinator?: {
        department: Department;
        program: Program;
        status: 'active' | 'pending' | 'inactive';
    };
}

export interface Announcements {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    data: Array<{
        id: number;
        type: string;
        title: string;
        body: string;
        department: Department;
        program: Program;
        created_at: string;
    }>;
}

export interface PaginatedResponse<> {
    announcements: Announcements;
}

export interface TimeRecord {
    id: number;
    student_id: number;
    time_in: string | null;
    time_out: string | null;
    date: string;
    time_in_image: string | null;
    time_out_image: string | null;
    required_hours: number;
    completed_hours: number | null;
    remarks: string | null;
    created_at: string;
    updated_at: string;
    student?: Student;
}
