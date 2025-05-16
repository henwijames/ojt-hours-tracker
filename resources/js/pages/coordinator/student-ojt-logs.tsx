import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Students, TimeRecord } from '@/types';
import { formatDate } from '@/utils/date';
import { Head } from '@inertiajs/react';

interface PageProps {
    student: Students;
    timeRecords: TimeRecord[];
}

export default function OjtLogs({ student, timeRecords }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Students',
            href: '/coordinator/students',
        },
        {
            title: `${student.user.name}'s OJT Logs`,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${student.user.name}'s Journals`} />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{student.user.name}'s Journal Entries</CardTitle>
                            <CardDescription>Browse through student's reflections and experiences</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Time In</TableHead>
                                            <TableHead>Time Out</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {timeRecords.length > 0 ? (
                                            timeRecords.map((timeRecord) => (
                                                <TableRow key={timeRecord.id}>
                                                    <TableCell>{formatDate(timeRecord.date)}</TableCell>
                                                    <TableCell>
                                                        <p className="tracking-wide">
                                                            {timeRecord.time_in ? new Date(timeRecord.time_in).toLocaleTimeString() : 'N/A'}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="tracking-wide">
                                                            {timeRecord.time_out ? new Date(timeRecord.time_out).toLocaleTimeString() : 'N/A'}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center">
                                                    No logs found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
