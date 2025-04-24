import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Department, type Program } from '@/types';
import { Head } from '@inertiajs/react';
import { GraduationCap, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: '/Departments',
    },
];

const programs: Program[] = [
    {
        id: 1,
        name: 'Bachelor of Science in Information Technology',
        department: 'College of Arts and Science',
        status: 'active',
    },
    {
        id: 2,
        name: 'Bachelor of Science in Computer Science',
        department: 'College of Arts and Science',
        status: 'inactive',
    },
];

const departments: Department[] = [
    {
        id: 1,
        name: 'College of Arts and Science',
        programs: [
            {
                id: 1,
                name: 'Bachelor of Science in Information Technology',
                department: 'College of Arts and Science',
                status: 'active',
            },
            {
                id: 2,
                name: 'Bachelor of Science in Computer Science',
                department: 'College of Arts and Science',

                status: 'inactive',
            },
        ],
        status: 'active',
    },
    {
        id: 2,
        name: 'College of Teacher Education',
        programs: [
            {
                id: 3,
                name: 'Bachelor of Elementary Education',
                department: 'College of Teacher Education',
                status: 'active',
            },
            {
                id: 4,
                name: 'Bachelor of Secondary Education',
                department: 'College of Teacher Education',
                status: 'inactive',
            },
        ],
        status: 'inactive',
    },
];

export default function Programs() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1>Programs</h1>
                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <GraduationCap />
                                    <span>Add Program</span>
                                    <Plus />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit profile</DialogTitle>
                                    <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="program" className="text-right">
                                            Program
                                        </Label>
                                        <Input id="program" placeholder="Bachelor of Science in Information Technology" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Department</Label>
                                        <Select>
                                            <SelectTrigger className="col-span-3 w-full">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Department</SelectLabel>
                                                    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                                    <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                                    <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                                    <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                                    <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                                    <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="dark:text-white">
                                        Add
                                        <Plus />
                                    </Button>
                                </DialogFooter>
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
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {programs.map((program) => (
                                <TableRow key={program.id}>
                                    <TableCell className="w-[100px]">{program.id}</TableCell>
                                    <TableCell>{program.name}</TableCell>
                                    <TableCell>{program.department}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={program.status === 'active' ? 'default' : 'destructive'} className="text-xs dark:text-white">
                                            {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
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
