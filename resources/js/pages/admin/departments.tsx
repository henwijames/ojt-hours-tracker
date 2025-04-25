import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { IconChevronDown } from '@tabler/icons-react';
import { Pencil, Plus, School, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: '/Departments',
    },
];

export default function Departments({ departments }: { departments: any[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        status: 'active',
    });
    // State for edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<any | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.departments.store'), {
            onSuccess: () => {
                reset('name', 'status');
                setIsAddModalOpen(false);
            },
        });
    };

    const addForm = useForm({
        name: '',
        status: 'active',
    });

    // Form for editing an existing program
    const editForm = useForm({
        name: '',
        status: 'active',
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('admin.departments.store'), {
            onSuccess: () => {
                addForm.reset();
                setIsAddModalOpen(false);
                toast.success('Department has been created.');
            },
            onError: (errors) => {
                toast.error('Failed to add department. Please check the form.');
                console.error(errors);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingProgram) {
            console.log('Updating Program:', editForm.data); // Check the data being sent
            editForm.setData({
                name: editForm.data.name,
                status: editForm.data.status,
            });

            editForm.put(route('admin.departments.update', editingProgram.id), {
                onSuccess: () => {
                    editForm.reset();
                    setIsEditModalOpen(false);
                    setEditingProgram(null);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    const handleEdit = (program: any) => {
        setEditingProgram(program);
        editForm.setData({
            name: program.name,
            status: program.status,
        });

        console.log('Edit Form Data:', editForm.data); // Log form data to verify it's being set

        setIsEditModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this program?')) {
            addForm.delete(route('admin.departments.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1>Departments</h1>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <School />
                                    <span>Choose Department</span>
                                    <IconChevronDown />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="mr-8 w-56">
                                <DropdownMenuGroup>
                                    {departments.map((department) => (
                                        <DropdownMenuItem key={department.id}>{department.name}</DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <School />
                                    <span>Add Department</span>
                                    <Plus />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Department</DialogTitle>
                                    <DialogDescription>Create a new program by filling out the form below.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="department" className="text-right">
                                                Department
                                            </Label>
                                            <div></div>
                                            <Input
                                                id="department"
                                                value={addForm.data.name}
                                                onChange={(e) => addForm.setData('name', e.target.value)}
                                                placeholder="College of Arts and Science"
                                                className="col-span-3"
                                            />
                                            {addForm.errors.name && <div className="text-sm text-red-500">{addForm.errors.name}</div>}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="dark:text-white" disabled={processing}>
                                            Add
                                            <Plus />
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Department</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="department" className="text-right">
                                                Department
                                            </Label>
                                            <>
                                                <Input
                                                    id="edit-department"
                                                    value={editForm.data.name}
                                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                                    placeholder="College of Arts and Science"
                                                    className="col-span-3"
                                                />
                                                {editForm.errors.name && <div className="text-sm text-red-500">{editForm.errors.name}</div>}
                                            </>
                                            <Label className="text-right">Status</Label>
                                            <>
                                                <Select value={editForm.data.status} onValueChange={(val) => editForm.setData('status', val)}>
                                                    <SelectTrigger className="col-span-3 w-full capitalize">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="dark:text-white" disabled={processing}>
                                            Save
                                            <Plus />
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            <TableRow>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.map((department) => (
                                <TableRow key={department.id}>
                                    <TableCell>{department.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={department.status === 'active' ? 'default' : 'destructive'}
                                            className="text-xs dark:text-white"
                                        >
                                            {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Button size="sm" variant="outline" onClick={() => handleEdit(department)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(department.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
