import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Coordinator, type Students } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/admin/users',
    },
];

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
];

export default function Users() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Tabs defaultValue="coordinator" className="w-full">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                        <TabsList className="grid w-[400px] grid-cols-2">
                            <TabsTrigger value="coordinator">Coordinator</TabsTrigger>
                            <TabsTrigger value="student">Student</TabsTrigger>
                        </TabsList>
                        <TabsContent value="coordinator">
                            <div className="overflow-hidden rounded-lg border">
                                <Table>
                                    <TableHeader className="bg-muted sticky top-0 z-10">
                                        <TableRow>
                                            <TableHead className="w-[100px]">#</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coordinators.map((coordinator) => (
                                            <TableRow key={coordinator.id}>
                                                <TableCell className="w-[100px]">{coordinator.id}</TableCell>
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
                                                <TableCell className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        <button className="text-sm text-blue-500">Edit</button>
                                                        <button className="text-sm text-red-500">Delete</button>
                                                    </div>
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
                                        <TableHead className="w-[100px]">#</TableHead>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Program</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="w-[100px]">{student.id}</TableCell>
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
                                            <TableCell className="text-right">
                                                <div className="flex items-center gap-2">
                                                    <button className="text-sm text-blue-500">Edit</button>
                                                    <button className="text-sm text-red-500">Delete</button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </AppLayout>
    );
}
