import { DashboardChart } from '@/components/dashboard-chart';
import { SectionCards } from '@/components/section-cards';
import { Badge } from '@/components/ui/badge';
import { ChartConfig } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, type Coordinator, type Students } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const chartData = [
    { month: 'January', student: 186 },
    { month: 'February', student: 305 },
    { month: 'March', student: 237 },
    { month: 'April', student: 73 },
    { month: 'May', student: 209 },
    { month: 'June', student: 214 },
];

const chartConfig = {
    student: {
        label: 'Daily OJT Logs',
        color: '#2563eb',
    },
} satisfies ChartConfig;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    user: {
        name: string;
        role: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'coordinator' | 'student';
}

interface PageProps {
    auth: {
        user: User;
        role: string;
        isAdmin: boolean;
        isCoordinator: boolean;
        isStudent: boolean;
    };
    [key: string]: any;
}

const coordinators: Coordinator[] = [
    {
        id: 1,
        name: 'Delio Atienza',
        email: 'example@email.com',
        department: 'College of Arts and Science',
        program: 'Bachelor of Science in Information Technology',
        status: 'active',
    },
    {
        id: 2,
        name: 'Bachelor of Science in Computer Science',
        email: 'example@email.com',
        department: 'College of Arts and Science',
        program: 'Bachelor of Science in Information Technology',
        status: 'inactive',
    },
];

const students: Students[] = [
    {
        id: 1,
        student_id: '2021-12272',
        name: 'Delio Atienza',
        email: 'example@email.com',
        department: 'College of Arts and Science',
        program: 'Bachelor of Science in Information Technology',
        status: 'active',
    },
    {
        id: 2,
        student_id: '2021-12272',
        name: 'Delio Atienza',
        email: 'example@email.com',
        department: 'College of Arts and Science',
        program: 'Bachelor of Science in Information Technology',
        status: 'active',
    },
    {
        id: 3,
        student_id: '2021-12272',
        name: 'Delio Atienza',
        email: 'example@email.com',
        department: 'College of Arts and Science',
        program: 'Bachelor of Science in Information Technology',
        status: 'active',
    },
    {
        id: 4,
        student_id: '2021-12272',
        name: 'Delio Atienza',
        email: 'example@email.com',
        department: 'College of Arts and Science',
        program: 'Bachelor of Science in Information Technology',
        status: 'active',
    },
];

export default function Dashboard({ user }: DashboardProps) {
    const { auth } = usePage<PageProps>().props;

    console.log(auth.isStudent);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards name={user.role} />
                </div>
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 md:grid-cols-2">
                    <DashboardChart data={chartData} config={chartConfig} />
                    <Tabs defaultValue="coordinator" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="coordinator">Coordinators</TabsTrigger>
                            <TabsTrigger value="student">Students</TabsTrigger>
                        </TabsList>
                        <TabsContent value="coordinator">
                            <div className="overflow-hidden rounded-lg border">
                                <Table>
                                    <TableHeader className="bg-muted sticky top-0 z-10">
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coordinators.map((coordinator) => (
                                            <TableRow key={coordinator.id}>
                                                <TableCell>{coordinator.id}</TableCell>
                                                <TableCell>{coordinator.name}</TableCell>
                                                <TableCell>example@email.com</TableCell>
                                                <TableCell>{coordinator.department}</TableCell>
                                                <TableCell>{coordinator.program}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={coordinator.status === 'active' ? 'default' : 'destructive'}
                                                        className="text-xs dark:text-white"
                                                    >
                                                        {coordinator.status.charAt(0).toUpperCase() + coordinator.status.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                        <TabsContent value="student">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Program</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="w-[100px]">{student.student_id}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>example@email.com</TableCell>
                                            <TableCell>{student.department}</TableCell>
                                            <TableCell>{student.program}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={student.status === 'active' ? 'default' : 'destructive'}
                                                    className="text-xs dark:text-white"
                                                >
                                                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
