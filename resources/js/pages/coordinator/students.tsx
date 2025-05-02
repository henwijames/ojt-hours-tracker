import PaginationComponent from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UserStatusBadge from '@/components/user-status-badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Coordinator, Students as Student } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Eye, Pencil } from 'lucide-react';
import { useState } from 'react';

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
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface PageProps {
    [key: string]: any;
    auth: {
        user: { name: string; role: string };
    };
    coordinators: PaginatedResponse<Coordinator>;
    students: PaginatedResponse<Student>;
}

export default function Students() {
    const { students, coordinator } = usePage<PageProps>().props;
    const [editModal, setEditModal] = useState(false);

    const studentData = students.data ?? [];

    const editStudent = useForm({
        id: '',
        status: '',
    });

    const handleEdit = (student: Student) => {
        editStudent.setData({
            id: String(student.id),
            status: student.status,
        });

        setEditModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editStudent.put(route('coordinator.students.update', { id: editStudent.data.id }), {
            onSuccess: () => {
                setEditModal(false);
            },
            onError: (errors) => {
                console.error('Error updating student:', errors);
            },
        });
    };

    const handlePagination = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students | Coordinator" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="font-bold">{coordinator.program.name}</h1>
                <p className="text-muted-foreground -mt-4 text-sm">Manage your students here.</p>

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
                                <TableHead>Actions</TableHead>
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
                                        <TableCell className="w-[100px]">
                                            <div className="flex items-center gap-2">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-white">View</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-white">Edit</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <PaginationComponent
                    links={students.links}
                    prevPageUrl={students.prev_page_url}
                    nextPageUrl={students.next_page_url}
                    currentPage={students.current_page}
                    lastPage={students.last_page}
                    handlePagination={handlePagination}
                />
                <Dialog open={editModal} onOpenChange={setEditModal}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Edit Student Status</DialogTitle>
                                <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Label htmlFor="status">Status</Label>
                                <Select value={editStudent.data.status} onValueChange={(val) => editStudent.setData('status', val)}>
                                    <SelectTrigger className="col-span-3 w-full capitalize">{editStudent.data.status}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="text-white">
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
