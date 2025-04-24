import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Program } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: '/Programs',
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

export default function Programs() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Table>
                    <TableHeader>
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
                                    <Badge variant={program.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                                        {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
