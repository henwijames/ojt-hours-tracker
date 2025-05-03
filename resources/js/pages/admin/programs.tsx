import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

// Types for better type safety
interface Department {
    id: number;
    name: string;
}

interface Program {
    id: number;
    name: string;
    status: 'active' | 'inactive';
    department: Department;
}

interface ProgramFormData {
    name: string;
    status: 'active' | 'inactive';
    department_id: string;
    [key: string]: string | 'active' | 'inactive'; // Add index signature
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: '/admin/programs',
    },
];

export default function Programs({ programs, departments }: { programs: Program[]; departments: Department[] }) {
    // Modals state
    const [modalState, setModalState] = useState({
        isAddOpen: false,
        isEditOpen: false,
        isDeleteOpen: false,
        programToDelete: null as number | null,
        editingProgram: null as Program | null,
    });

    // Form for adding a new program
    const addForm = useForm<ProgramFormData>({
        name: '',
        status: 'active',
        department_id: '',
    });

    // Form for editing an existing program
    const editForm = useForm<ProgramFormData>({
        name: '',
        status: 'active',
        department_id: '',
    });

    // Memoized mapping of departments to select items
    const departmentOptions = useMemo(
        () =>
            departments.map((department) => (
                <SelectItem key={department.id} value={department.id.toString()}>
                    {department.name}
                </SelectItem>
            )),
        [departments],
    );

    // Form handlers
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('admin.programs.store'), {
            onSuccess: () => {
                addForm.reset();
                setModalState((prev) => ({ ...prev, isAddOpen: false }));
                toast.success('Program added successfully');
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (modalState.editingProgram) {
            editForm.put(route('admin.programs.update', modalState.editingProgram.id), {
                onSuccess: () => {
                    editForm.reset();
                    setModalState((prev) => ({
                        ...prev,
                        isEditOpen: false,
                        editingProgram: null,
                    }));
                    toast.success('Program updated successfully');
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Failed to update program');
                },
            });
        }
    };

    const handleEdit = (program: Program) => {
        editForm.setData({
            name: program.name,
            status: program.status,
            department_id: program.department.id.toString(),
        });

        setModalState((prev) => ({
            ...prev,
            isEditOpen: true,
            editingProgram: program,
        }));
    };

    const handleDeleteClick = (id: number) => {
        setModalState((prev) => ({
            ...prev,
            isDeleteOpen: true,
            programToDelete: id,
        }));
    };

    const confirmDelete = () => {
        if (modalState.programToDelete) {
            addForm.delete(route('admin.programs.destroy', modalState.programToDelete), {
                onSuccess: () => {
                    setModalState((prev) => ({
                        ...prev,
                        isDeleteOpen: false,
                        programToDelete: null,
                    }));
                },
                onError: () => {
                    toast.error('Failed to delete program');
                },
            });
        }
    };

    // Form error components for reusability
    const FormError = ({ error }: { error?: string }) => (error ? <p className="text-sm text-red-500">{error}</p> : null);

    // Status badge component
    const StatusBadge = ({ status }: { status: string }) => (
        <Badge variant={status === 'active' ? 'default' : 'destructive'} className="text-xs dark:text-white">
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1>Programs</h1>
                    <div className="flex items-center gap-2">
                        {/* Add Program Modal */}
                        <Dialog open={modalState.isAddOpen} onOpenChange={(isOpen) => setModalState((prev) => ({ ...prev, isAddOpen: isOpen }))}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                    <Plus className="mr-2" /> Add Program
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Program</DialogTitle>
                                    <DialogDescription>Create a new program by filling out the form below.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="program">Program</Label>
                                            <Input
                                                id="program"
                                                placeholder="Bachelor of Science in Information Technology"
                                                value={addForm.data.name}
                                                onChange={(e) => addForm.setData('name', e.target.value)}
                                            />
                                            <FormError error={addForm.errors.name} />

                                            <Label>Department</Label>
                                            <Select
                                                value={addForm.data.department_id}
                                                onValueChange={(value) => addForm.setData('department_id', value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Department</SelectLabel>
                                                        {departmentOptions}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormError error={addForm.errors.department_id} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={addForm.processing} className="bg-primary hover:bg-primary/80 text-white">
                                            Add
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Edit Program Modal */}
                <Dialog open={modalState.isEditOpen} onOpenChange={(isOpen) => setModalState((prev) => ({ ...prev, isEditOpen: isOpen }))}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Program</DialogTitle>
                            <DialogDescription>Make changes to the selected program.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="edit-program">Program</Label>
                                    <Input
                                        id="edit-program"
                                        placeholder="Bachelor of Science in Information Technology"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                    />
                                    <FormError error={editForm.errors.name} />

                                    <Label>Department</Label>
                                    <Select value={editForm.data.department_id} onValueChange={(value) => editForm.setData('department_id', value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Department</SelectLabel>
                                                {departmentOptions}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormError error={editForm.errors.department_id} />

                                    <Label>Status</Label>
                                    <Select
                                        value={editForm.data.status}
                                        onValueChange={(val) => editForm.setData('status', val as 'active' | 'inactive')}
                                    >
                                        <SelectTrigger className="w-full capitalize">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editForm.processing}>
                                    Update
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={modalState.isDeleteOpen} onOpenChange={(isOpen) => setModalState((prev) => ({ ...prev, isDeleteOpen: isOpen }))}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this program?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the program.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Programs Table */}
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            <TableRow>
                                <TableHead>Program</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {programs.map((program) => (
                                <TableRow key={program.id}>
                                    <TableCell>{program.name}</TableCell>
                                    <TableCell>{program.department.name}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={program.status} />
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Button size="sm" variant="outline" onClick={() => handleEdit(program)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(program.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {programs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-muted-foreground py-8 text-center">
                                        No programs found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
