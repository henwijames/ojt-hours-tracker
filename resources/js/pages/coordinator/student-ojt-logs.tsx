import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Students, TimeRecord } from '@/types';
import { Head } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Calendar, XCircle } from 'lucide-react';

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

    const getImageUrl = (path: string | null): string | undefined => {
        if (!path) return undefined;
        return `/storage/${path}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${student.user.name}'s Journals`} />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{student.user.name}'s On-the-Job Training Time Records</CardTitle>
                            <CardDescription>Browse through student's on-the-job training time records</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                                {timeRecords.length > 0 ? (
                                    timeRecords.map((timeRecord) => (
                                        <Card key={timeRecord.id} className="flex flex-col gap-4 overflow-visible p-4 shadow-md">
                                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="text-muted-foreground h-5 w-5" />
                                                        <span className="font-semibold">Time In:</span>
                                                        <span className="text-muted-foreground">
                                                            {timeRecord.time_in
                                                                ? format(parseISO(timeRecord.time_in), 'MMMM dd, yyyy hh:mm:ss a')
                                                                : 'Not recorded'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <XCircle className="h-5 w-5 text-red-500" />
                                                        <span className="font-semibold">Time Out:</span>
                                                        <span className="text-muted-foreground">
                                                            {timeRecord.time_out
                                                                ? format(parseISO(timeRecord.time_out), 'MMMM dd, yyyy hh:mm:ss a')
                                                                : 'Not recorded'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex gap-4">
                                                {timeRecord.time_in_image && (
                                                    <img
                                                        src={getImageUrl(timeRecord.time_in_image)}
                                                        alt="Time in proof"
                                                        className="h-32 w-32 rounded-lg border object-cover shadow-md"
                                                    />
                                                )}
                                                {timeRecord.time_out_image && (
                                                    <img
                                                        src={getImageUrl(timeRecord.time_out_image)}
                                                        alt="Time out proof"
                                                        className="h-32 w-32 rounded-lg border object-cover shadow-md"
                                                    />
                                                )}
                                            </div>
                                            {timeRecord.rendered_hours && (
                                                <div className="bg-muted mt-2 rounded-lg p-2 text-center">
                                                    <p className="text-sm font-medium">Rendered Hours: {timeRecord.rendered_hours}</p>
                                                </div>
                                            )}
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-muted-foreground col-span-full text-center">No logs found</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
