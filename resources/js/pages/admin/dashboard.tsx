import { SectionCards } from '@/components/section-cards';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, type Coordinator, type Students } from '@/types';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface PageProps extends InertiaPageProps {
    auth: {
        user: { name: string; role: string };
    };
    coordinators: PaginatedResponse<Coordinator>;
    students: PaginatedResponse<Students>;
    coordinatorCount: number;
    studentsCount: number;
    departmentsCount: number;
    programsCount: number;
}

const UserStatusBadge = ({ status }: { status: string }) => {
    const getVariant = () => {
        if (status === 'active') return 'default';
        if (status === 'inactive') return 'destructive';
        return 'secondary';
    };

    const isPending = status === 'pending';

    return (
        <Badge variant={getVariant()} className={`text-xs capitalize dark:text-white ${isPending ? 'bg-yellow-500 text-white' : ''}`}>
            {status}
        </Badge>
    );
};

export default function Dashboard() {
    const { auth, coordinators, students, coordinatorCount, studentsCount, departmentsCount, programsCount } = usePage<PageProps>().props;

    const coordinatorData = coordinators?.data ?? [];
    const studentData = students?.data ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="@container/main flex flex-1 flex-col gap-4 p-6">
                <h1 className="mb-2 text-2xl font-semibold">
                    Welcome, <span className="text-primary capitalize">{auth.user.role}</span> !
                </h1>
                <div className="flex flex-col gap-4 md:gap-6">
                    <SectionCards
                        coordinatorCount={coordinatorCount}
                        studentCount={studentsCount}
                        departmentCount={departmentsCount}
                        programCount={programsCount}
                    />
                </div>

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
                                    {coordinatorData.length > 0 ? (
                                        coordinatorData.map((coordinator) => (
                                            <TableRow key={coordinator.id}>
                                                <TableCell>{coordinator.id}</TableCell>
                                                <TableCell>{coordinator.name}</TableCell>
                                                <TableCell>{coordinator.email}</TableCell>
                                                <TableCell>{coordinator.coordinator?.department?.name ?? '-'}</TableCell>
                                                <TableCell>{coordinator.coordinator?.program?.name ?? '-'}</TableCell>
                                                <TableCell>
                                                    <UserStatusBadge status={coordinator.coordinator?.status ?? 'unknown'} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center">
                                                No coordinators found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                {coordinators.prev_page_url && (
                                    <a href={coordinators.prev_page_url} className="text-primary">
                                        Previous
                                    </a>
                                )}
                                {coordinators.next_page_url && (
                                    <a href={coordinators.next_page_url} className="text-primary ml-4">
                                        Next
                                    </a>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">
                                Page {coordinators.current_page} of {coordinators.last_page}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="student">
                        <div className="overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader className="bg-muted sticky top-0 z-10">
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
                                    {studentData.length > 0 ? (
                                        studentData.map((student) => (
                                            <TableRow key={student?.id}>
                                                <TableCell className="w-[100px]">{student.student?.student_id}</TableCell>
                                                <TableCell>{student.name}</TableCell>
                                                <TableCell>{student.email}</TableCell>
                                                <TableCell>{student.student?.department.name}</TableCell>
                                                <TableCell>{student.student?.program.name}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            student.student?.status === 'active'
                                                                ? 'default'
                                                                : student.student?.status === 'inactive'
                                                                  ? 'destructive'
                                                                  : 'default'
                                                        }
                                                        className={`text-xs capitalize dark:text-white ${student.student?.status !== 'active' && student.student?.status !== 'inactive' ? 'bg-yellow-600' : ''}`}
                                                    >
                                                        {student.student?.status === 'active'
                                                            ? 'Active'
                                                            : student.student?.status === 'inactive'
                                                              ? 'Inactive'
                                                              : 'Pending'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center">
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    )}{' '}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                {students.prev_page_url && (
                                    <a href={students.prev_page_url} className="text-primary">
                                        Previous
                                    </a>
                                )}
                                {students.next_page_url && (
                                    <a href={students.next_page_url} className="text-primary ml-4">
                                        Next
                                    </a>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">
                                Page {students.current_page} of {students.last_page}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
