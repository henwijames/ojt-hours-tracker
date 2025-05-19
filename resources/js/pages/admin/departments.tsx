import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus, School, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Department {
    id: number;
    name: string;
    status: 'active' | 'inactive';
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: '/admin/departments',
    },
];

export default function Departments({ departments }: { departments: Department[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    const addForm = useForm<{
        name: string;
        status: 'active' | 'inactive';
    }>({
        name: '',
        status: 'active',
    });

    const editForm = useForm<{
        name: string;
        status: 'active' | 'inactive';
    }>({
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

        if (editingDepartment) {
            editForm.put(route('admin.departments.update', editingDepartment.id), {
                onSuccess: () => {
                    editForm.reset();
                    setIsEditModalOpen(false);
                    setEditingDepartment(null);
                    toast.success('Department has been updated.');
                },
                onError: (errors) => {
                    toast.error('Failed to update department.');
                    console.error(errors);
                },
            });
        }
    };

    const handleEdit = (department: Department) => {
        setEditingDepartment(department);
        editForm.setData({
            name: department.name,
            status: department.status,
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            addForm.delete(route('admin.departments.destroy', id), {
                onSuccess: () => {
                    toast.success('Department has been deleted.');
                },
                onError: () => {
                    toast.error('Failed to delete department.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1>Departments</h1>
                    <div className="flex items-center gap-2">
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
                                        <Button type="submit" className="dark:text-white" disabled={addForm.processing}>
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
                                                <Select
                                                    value={editForm.data.status}
                                                    onValueChange={(val) => editForm.setData('status', val as 'active' | 'inactive')}
                                                >
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
                                        <Button type="submit" className="dark:text-white" disabled={editForm.processing}>
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
                                <TableHead className="text-right">Actions</TableHead>
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
