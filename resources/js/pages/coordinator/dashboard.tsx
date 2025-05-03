import { DashboardChart } from '@/components/dashboard-chart';
import PaginationComponent from '@/components/pagination';
import { SectionCards } from '@/components/section-cards';
import { StudentStatusChart } from '@/components/student-status-chart';
import { ChartConfig } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserStatusBadge from '@/components/user-status-badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, type Coordinator, type Students } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

// Chart data
const chartData = [
    { month: 'January', student: 186 },
    { month: 'February', student: 305 },
    { month: 'March', student: 237 },
    { month: 'April', student: 73 },
    { month: 'May', student: 209 },
    { month: 'June', student: 214 },
];

// Chart configurations
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

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface PageProps {
    [key: string]: any; // Add index signature
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

export default function Dashboard() {
    const { auth, students, coordinator, coordinatorCount, studentsCount, departmentsCount, programsCount } = usePage<PageProps>().props;

    const studentData = students.data ?? [];

    console.log('Student Data:', studentData); // Log the student data to check its structure

    const user = auth.user;
    console.log('User:', user); // Log the user data to check its structure

    const activeStudentsCount = studentData.filter((student) => student.status === 'active').length;
    const inactiveStudentsCount = studentData.filter((student) => student.status === 'inactive').length;
    const pendingStudentsCount = studentData.filter((student) => student.status === 'pending').length;

    console.log(activeStudentsCount, inactiveStudentsCount);
    // Student status data for pie chart
    const studentStatusData = [
        { status: 'Active', count: activeStudentsCount, color: '#2563eb' }, // Blue color for active
        { status: 'Inactive', count: inactiveStudentsCount, color: '#dc2626' }, // Red color for inactive
        { status: 'Pending', count: pendingStudentsCount, color: '#D08700' }, // Yellow color for pennding
    ];

    const handlePagination = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="@container/main flex flex-1 flex-col gap-4 p-6">
                <h1 className="m-0 text-2xl font-semibold">
                    Welcome, <span className="text-primary capitalize">{user.role}</span> !
                </h1>
                <p className="text-xs uppercase">
                    {coordinator.department?.name} - <span className="text-primary font-bold">{coordinator.program?.name}</span>
                </p>

                <div className="flex flex-col gap-4 md:gap-6">
                    <SectionCards
                        coordinatorCount={coordinatorCount}
                        studentCount={studentsCount}
                        departmentCount={departmentsCount}
                        programCount={programsCount}
                    />
                </div>

                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                    <DashboardChart data={chartData} config={chartConfig} />

                    <StudentStatusChart
                        title="Student Status Distribution"
                        description="Active vs. Inactive Students"
                        data={studentStatusData}
                        config={chartConfig}
                    />
                </div>
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
                                        <TableCell className="w-[100px]">{student.student_id}</TableCell>
                                        <TableCell>{student.user?.name}</TableCell>
                                        <TableCell>{student.user?.email}</TableCell>
                                        <TableCell>{student.department.name}</TableCell>
                                        <TableCell>{student.program.name}</TableCell>
                                        <TableCell>
                                            <UserStatusBadge status={student.status} />
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
                <PaginationComponent
                    links={students?.links}
                    prevPageUrl={students?.prev_page_url}
                    nextPageUrl={students?.next_page_url}
                    currentPage={students?.current_page}
                    lastPage={students?.last_page}
                    handlePagination={handlePagination}
                />
            </div>
        </AppLayout>
    );
}
