import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Department, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/admin/users',
    },
];

type UserFormData = {
    name: string;
    email: string;
    status: string;
    department_id?: string;
    program_id?: string;
};

type EditSheetProps = {
    type: 'student' | 'coordinator';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedUser: any;
    formData: UserFormData;
    setFormData: (key: string, value: string) => void;
    processing: boolean;
    selectedDepartment: Department | null;
    departments: Department[];
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

// Extracted EditSheet component for better separation of concerns
const EditSheet = ({
    type,
    open,
    onOpenChange,
    selectedUser,
    formData,
    setFormData,
    processing,
    selectedDepartment,
    departments,
    onSubmit,
}: EditSheetProps) => {
    if (!selectedUser) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit {type === 'coordinator' ? 'Coordinator' : 'Student'}</SheetTitle>
                    <SheetDescription>Make changes to the {type === 'coordinator' ? 'coordinator' : 'student'}'s information here.</SheetDescription>
                </SheetHeader>
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col gap-4 p-4">
                        <div>
                            <Label htmlFor="name" className="mb-1">
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData('name', e.target.value)}
                                className="w-full rounded-md border p-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="mb-1">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData('email', e.target.value)}
                                className="w-full rounded-md border p-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="status" className="mb-1">
                                Status
                            </Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData('status', value)}>
                                <SelectTrigger className="w-full rounded-md border p-2">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {type === 'coordinator' && (
                            <>
                                <Separator />
                                <div>
                                    <h1 className="mb-2">Assign Department & Program</h1>
                                    <div className="mb-2">
                                        <Label htmlFor="department" className="mb-1">
                                            Department
                                        </Label>
                                        <Select
                                            onValueChange={(value) => {
                                                setFormData('department_id', value);
                                                setFormData('program_id', '');
                                            }}
                                            value={formData.department_id}
                                            disabled={processing || departments.length === 0}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                {departments.map((department) => (
                                                    <SelectItem key={department.id} value={department.id.toString()}>
                                                        {department.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="program">Program</Label>
                                        <Select
                                            onValueChange={(value) => setFormData('program_id', value)}
                                            value={formData.program_id || ''}
                                            disabled={!formData.department_id || processing}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select your program" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {selectedDepartment && selectedDepartment.programs.length > 0 ? (
                                                    selectedDepartment.programs.map((program) => (
                                                        <SelectItem key={program.id} value={program.id.toString()}>
                                                            {program.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-sm text-gray-500">No programs available for this department</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </>
                        )}

                        <Button className="mt-4 text-white" type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};

// User status badge component for DRY code
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

// Action buttons component
const ActionButtons = ({ onEdit, onDelete }: { onEdit: () => void; onDelete?: () => void }) => (
    <div className="flex items-center gap-2">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={onEdit}>
                    <Pencil className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p className="text-white">Edit</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
            <TooltipTrigger asChild>
                <Button size="sm" variant="destructive" onClick={onDelete}>
                    <Trash className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p className="text-white">Delete</p>
            </TooltipContent>
        </Tooltip>
    </div>
);

export default function Users({ coordinators, students, departments }: { coordinators: any[]; students: any[]; departments: Department[] }) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'coordinator' | 'student'>('coordinator');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [selectedCoordinator, setSelectedCoordinator] = useState<any>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const {
        data: studentData,
        setData: setStudentData,
        put: putStudent,
        processing: processingStudent,
        reset: resetStudent,
        errors: studentErrors,
    } = useForm<UserFormData>({
        name: '',
        email: '',
        status: '',
    });

    const {
        data: coordinatorData,
        setData: setCoordinatorData,
        put: putCoordinator,
        processing: processingCoordinator,
        reset: resetCoordinator,
        errors: coordinatorErrors,
    } = useForm<UserFormData>({
        name: '',
        email: '',
        status: '',
        department_id: '',
        program_id: '',
    });

    // Find and update selectedDepartment when coordinator department_id changes
    useEffect(() => {
        if (coordinatorData.department_id) {
            const dept = departments.find((d) => d.id.toString() === coordinatorData.department_id);
            setSelectedDepartment(dept || null);
        }
    }, [coordinatorData.department_id, departments]);

    // Clean up state when sheet closes
    useEffect(() => {
        if (!open) {
            setSelectedStudent(null);
            setSelectedCoordinator(null);
            resetStudent();
            resetCoordinator();
        }
    }, [open, resetStudent, resetCoordinator]);

    const handleEditStudent = (student: any) => {
        setSelectedStudent(student);
        setStudentData({
            name: student.name || '',
            email: student.email || '',
            status: student.student?.status || '',
        });
        setActiveTab('student');
        setOpen(true);
    };

    const handleEditCoordinator = (coordinator: any) => {
        setSelectedCoordinator(coordinator);
        setCoordinatorData({
            name: coordinator.name || '',
            email: coordinator.email || '',
            status: coordinator.coordinator?.status || '',
            department_id: coordinator.coordinator?.department_id?.toString() || '',
            program_id: coordinator.coordinator?.program_id?.toString() || '',
        });

        // Set selected department for program dropdown
        if (coordinator.coordinator?.department_id) {
            const dept = departments.find((d) => d.id.toString() === coordinator.coordinator.department_id.toString());
            setSelectedDepartment(dept || null);
        }

        setActiveTab('coordinator');
        setOpen(true);
    };

    const handleStudentSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedStudent) return;

        putStudent(route('admin.users.update', selectedStudent.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const handleCoordinatorSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedCoordinator) return;

        putCoordinator(route('admin.users.update', selectedCoordinator.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    // Memoized handlers for form submission
    const activeFormProps = useMemo(() => {
        if (activeTab === 'student') {
            return {
                type: 'student' as const,
                selectedUser: selectedStudent,
                formData: studentData,
                setFormData: setStudentData,
                processing: processingStudent,
                onSubmit: handleStudentSaveChanges,
            };
        } else {
            return {
                type: 'coordinator' as const,
                selectedUser: selectedCoordinator,
                formData: coordinatorData,
                setFormData: setCoordinatorData,
                processing: processingCoordinator,
                onSubmit: handleCoordinatorSaveChanges,
            };
        }
    }, [activeTab, selectedStudent, selectedCoordinator, studentData, coordinatorData, processingStudent, processingCoordinator]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'coordinator' | 'student')} className="w-full">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                            <TabsTrigger value="coordinator">Coordinator</TabsTrigger>
                            <TabsTrigger value="student">Student</TabsTrigger>
                        </TabsList>

                        {/* Coordinator Tab */}
                        <TabsContent value="coordinator">
                            <div className="overflow-hidden rounded-lg border">
                                <Table>
                                    <TableHeader className="bg-muted sticky top-0 z-10">
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coordinators.length > 0 ? (
                                            coordinators.map((coordinator) => (
                                                <TableRow key={coordinator.id}>
                                                    <TableCell>{coordinator.name}</TableCell>
                                                    <TableCell>{coordinator.email}</TableCell>
                                                    <TableCell>{coordinator.coordinator?.department?.name}</TableCell>
                                                    <TableCell>{coordinator.coordinator?.program?.name}</TableCell>
                                                    <TableCell>
                                                        <UserStatusBadge status={coordinator.coordinator?.status} />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <ActionButtons
                                                            onEdit={() => handleEditCoordinator(coordinator)}
                                                            onDelete={() => {
                                                                /* Implement delete handler */
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center">
                                                    No coordinators found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        {/* Student Tab */}
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
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.length > 0 ? (
                                            students.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="w-[100px]">{student.student?.student_id}</TableCell>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.email}</TableCell>
                                                    <TableCell>{student.student?.department?.name}</TableCell>
                                                    <TableCell>{student.student?.program?.name}</TableCell>
                                                    <TableCell>
                                                        <UserStatusBadge status={student.student?.status} />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <ActionButtons
                                                            onEdit={() => handleEditStudent(student)}
                                                            onDelete={() => {
                                                                /* Implement delete handler */
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center">
                                                    No students found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Shared Edit Sheet Component */}
                <EditSheet
                    {...activeFormProps}
                    open={open}
                    onOpenChange={setOpen}
                    selectedDepartment={selectedDepartment}
                    departments={departments}
                />
            </div>
        </AppLayout>
    );
}
