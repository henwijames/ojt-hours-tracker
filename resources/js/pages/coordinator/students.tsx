import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserStatusBadge from '@/components/user-status-badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Coordinator, Students as Student } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/coordinator/students',
    },
];

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface PageProps {
    [key: string]: any; // Add index signature
    auth: {
        user: { name: string; role: string };
    };
    coordinators: PaginatedResponse<Coordinator>;
    students: PaginatedResponse<Student>;
}

export default function Students() {
    const { auth, students, coordinator, departments } = usePage<PageProps>().props;

    const studentData = students.data ?? [];
    console.log('Students:', students); // Log the students data to check its structure

    console.log('Departments:', departments); // Log the departments data to check its structure

    console.log('Coordinator:', coordinator); // Log the coordinator data to check its structure

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students | Coordinator" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="font-bold sm:text-lg lg:text-2xl">{coordinator.program.name}</h1>
                <p className="-mt-4 text-gray-600 sm:text-sm lg:text-lg">Manage your students here.</p>
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
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        {students?.prev_page_url && (
                            <a href={students.prev_page_url} className="text-primary">
                                Previous
                            </a>
                        )}
                        {students?.next_page_url && (
                            <a href={students.next_page_url} className="text-primary ml-4">
                                Next
                            </a>
                        )}
                    </div>
                    <div className="text-sm text-gray-500">
                        Page {students?.current_page} of {students?.last_page}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
