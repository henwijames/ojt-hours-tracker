import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { IconChevronDown } from '@tabler/icons-react';
import { Plus, School } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: '/Departments',
    },
];

export default function Departments({ departments }: { departments: any[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.departments.store'), {
            onSuccess: () => {
                reset('name', 'status');
                setOpen(false);
            },
        });
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
                        <Dialog open={open} onOpenChange={setOpen}>
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
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="department" className="text-right">
                                                Department
                                            </Label>
                                            <>
                                                <Input
                                                    id="department"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="College of Arts and Science"
                                                    className="col-span-3"
                                                />
                                                {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
                                            </>
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
                    </div>
                </div>
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.map((department) => (
                                <TableRow key={department.id}>
                                    <TableCell>{department.id}</TableCell>
                                    <TableCell>{department.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={department.status === 'active' ? 'default' : 'destructive'}
                                            className="text-xs dark:text-white"
                                        >
                                            {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                                        </Badge>
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
