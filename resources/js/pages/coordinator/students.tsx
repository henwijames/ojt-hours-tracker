import PaginationComponent from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UserStatusBadge from '@/components/user-status-badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Coordinator, Students as Student } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { BookOpen, Eye, Logs, Pencil, Plus, Search } from 'lucide-react';
import { useCallback, useState } from 'react';

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
    [key: string]: unknown;
    auth: {
        user: { name: string; role: string };
    };
    coordinator: {
        program: { name: string; required_hours?: number };
    };
    coordinators: PaginatedResponse<Coordinator>;
    students: PaginatedResponse<Student>;
    filters: {
        search?: string;
    };
}

export default function Students() {
    const { students, coordinator, filters } = usePage<PageProps>().props;
    const [editModal, setEditModal] = useState(false);
    const [requiredHoursModal, setRequiredHoursModal] = useState(false);
    const [search, setSearch] = useState((filters?.search as string) ?? '');

    const studentData = students.data ?? [];

    const debouncedSearch = useCallback((query: string) => {
        debounce((value: string) => {
            router.get(route('coordinator.students.index'), { search: value }, { preserveState: true, preserveScroll: true });
        }, 300)(query);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const editStudent = useForm({
        id: '',
        status: '',
    });

    const requiredHoursForm = useForm({
        required_hours: coordinator.program.required_hours?.toString() ?? '',
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

    const handleAddRequiredHours = (e: React.FormEvent) => {
        e.preventDefault();
        requiredHoursForm.post(route('coordinator.students.required-hours'), {
            onSuccess: () => {
                setRequiredHoursModal(false);
            },
        });
    };

    console.log(students);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students | Coordinator" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex w-full flex-col justify-between gap-2 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <h1 className="font-bold">{coordinator.program.name}</h1>
                    </div>
                    <div className="flex w-full flex-1/2 items-center gap-2 sm:justify-end">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                            <Input type="text" placeholder="Search students..." className="max-w-sm pl-8" value={search} onChange={handleSearch} />
                        </div>
                        <Dialog open={requiredHoursModal} onOpenChange={setRequiredHoursModal}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Plus className="h-4 w-4" />
                                    {coordinator.program.required_hours ? 'Update Required Hours' : 'Add Required Hours'}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{coordinator.program.required_hours ? 'Update Required Hours' : 'Add Required Hours'}</DialogTitle>
                                    <DialogDescription>
                                        {coordinator.program.required_hours ? 'Update ' : 'Add '} the required hours for the program.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddRequiredHours}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="required_hours">Required Hours</Label>
                                            <Input
                                                type="number"
                                                id="required_hours"
                                                value={requiredHoursForm.data.required_hours}
                                                onChange={(e) => requiredHoursForm.setData('required_hours', e.target.value)}
                                            />
                                            {requiredHoursForm.errors.required_hours && (
                                                <p className="text-sm text-red-500">{requiredHoursForm.errors.required_hours}</p>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="text-white" disabled={requiredHoursForm.processing}>
                                            {requiredHoursForm.processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <p className="text-muted-foreground -mt-4 hidden text-sm sm:block">Manage your students here.</p>

                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Company</TableHead>
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
                                        <TableCell>{student.company_submission?.company_name ?? 'N/A'}</TableCell>
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
                                                        <p className="text-white">Edit Status</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link href={route('coordinator.students.journals', { id: student.user.id })}>
                                                            <Button size="sm" variant="outline">
                                                                <BookOpen className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-white">Show Journals</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link href={route('coordinator.students.ojt-logs', { id: student.user.id })}>
                                                            <Button size="sm" variant="outline">
                                                                <Logs className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-white">Show OJT Logs</p>
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
