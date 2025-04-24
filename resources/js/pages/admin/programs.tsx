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
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: '/Departments',
    },
];

export default function Programs({ programs, departments }: { programs: any[]; departments: any[] }) {
    // State for add modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // State for edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<any | null>(null);

    // Form for adding a new program
    const addForm = useForm({
        name: '',
        status: 'active',
        department_id: '',
    });

    // Form for editing an existing program
    const editForm = useForm({
        name: '',
        status: 'active',
        department_id: '',
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('admin.programs.store'), {
            onSuccess: () => {
                addForm.reset();
                setIsAddModalOpen(false);
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
                department_id: editForm.data.department_id,
            });

            editForm.put(route('admin.programs.update', editingProgram.id), {
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
            department_id: program.department.id.toString(),
        });

        console.log('Edit Form Data:', editForm.data); // Log form data to verify it's being set

        setIsEditModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this program?')) {
            addForm.delete(route('admin.programs.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1>Programs</h1>
                    <div className="flex items-center gap-2">
                        {/* Add Program Modal */}
                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="program" className="text-right">
                                                Program
                                            </Label>
                                            <>
                                                <Input
                                                    id="program"
                                                    placeholder="Bachelor of Science in Information Technology"
                                                    value={addForm.data.name}
                                                    onChange={(e) => addForm.setData('name', e.target.value)}
                                                    className="col-span-3"
                                                />
                                                {addForm.errors.name && <p className="text-sm text-red-500">{addForm.errors.name}</p>}
                                            </>

                                            <Label className="text-right">Department</Label>
                                            <>
                                                <Select onValueChange={(value) => addForm.setData('department_id', value)}>
                                                    <SelectTrigger className="col-span-3 w-full">
                                                        <SelectValue placeholder="Select Department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Department</SelectLabel>
                                                            {departments.map((department: any) => (
                                                                <SelectItem key={department.id} value={department.id.toString()}>
                                                                    {department.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {addForm.errors.department_id && (
                                                    <div className="text-sm text-red-500">{addForm.errors.department_id}</div>
                                                )}
                                            </>

                                            <Label className="text-right">Status</Label>
                                            <>
                                                <Select value={addForm.data.status} onValueChange={(val) => addForm.setData('status', val)}>
                                                    <SelectTrigger className="col-span-3 w-full capitalize">{addForm.data.status}</SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={addForm.processing}>
                                            Add
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* Edit Program Modal */}
                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Program</DialogTitle>
                                    <DialogDescription>Make changes to the selected program.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-program" className="text-right">
                                                Program
                                            </Label>
                                            <>
                                                <Input
                                                    id="edit-program"
                                                    placeholder="Bachelor of Science in Information Technology"
                                                    value={editForm.data.name}
                                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                                    className="col-span-3"
                                                />
                                                {editForm.errors.name && <p className="text-sm text-red-500">{editForm.errors.name}</p>}
                                            </>

                                            <Label className="text-right">Department</Label>
                                            <>
                                                <Select
                                                    value={editForm.data.department_id}
                                                    onValueChange={(value) => editForm.setData('department_id', value)}
                                                >
                                                    <SelectTrigger className="col-span-3 w-full">
                                                        <SelectValue placeholder="Select Department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Department</SelectLabel>
                                                            {departments.map((department: any) => (
                                                                <SelectItem key={department.id} value={department.id.toString()}>
                                                                    {department.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {editForm.errors.department_id && (
                                                    <div className="text-sm text-red-500">{editForm.errors.department_id}</div>
                                                )}
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
                                        <Button type="submit" disabled={editForm.processing}>
                                            Update
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
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Program</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {programs.map((program) => (
                                <TableRow key={program.id}>
                                    <TableCell className="w-[100px]">{program.id}</TableCell>
                                    <TableCell>{program.name}</TableCell>
                                    <TableCell>{program.department.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={program.status === 'active' ? 'default' : 'destructive'} className="text-xs dark:text-white">
                                            {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Button size="sm" variant="outline" onClick={() => handleEdit(program)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(program.id)}>
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
