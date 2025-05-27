import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Building, Clock, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

interface PageProps<T = object> {
    auth: {
        user: {
            name: string;
            role: string;
        };
    };
    props: T;
    companySubmission: {
        id: number;
        company_name: string;
        company_address: string;
        supervisor_name: string;
        supervisor_contact: number;
        submitted_at: string;
        status: string;
    };
    student: {
        id: number;
        student_id: string;
        name: string;
        email: string;
        department: string;
        program: string;
        status: string;
        completed_hours: number;
        face_descriptor: number[] | null;
    };
    announcements: {
        id: number;
        title: string;
        body: string;
        created_at: string;
    }[];
    timeRecords: {
        id: number;
        time_in: string;
        time_out: string;
        created_at: string;
    }[];
    totalTimeRecords: number;
    requiredHours: number;
}

export default function Dashboard({ auth, companySubmission, student, announcements, timeRecords, totalTimeRecords, requiredHours }: PageProps) {
    const [progress, setProgress] = useState(0);
    const [showFaceDialog, setShowFaceDialog] = useState(false);

    const user = auth.user;
    const companyData = companySubmission;

    // Ensure we have valid numbers and prevent NaN
    const completedHours = Number(student.completed_hours) || 0;
    const requiredHoursNum = Number(requiredHours) || 0;

    const progressValue = requiredHoursNum > 0 ? Math.min(100, Math.max(0, (completedHours / requiredHoursNum) * 100)) : 0;

    useEffect(() => {
        if (!isNaN(progressValue)) {
            setProgress(progressValue);
        }
    }, [progressValue]);

    useEffect(() => {
        if (!student.face_descriptor) {
            setShowFaceDialog(true);
        }
    }, [student.face_descriptor]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <AlertDialog open={showFaceDialog} onOpenChange={setShowFaceDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Face Registration Required</AlertDialogTitle>
                        <AlertDialogDescription>
                            You need to register your face for attendance tracking. Please complete the face registration process to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction asChild>
                            <Link href={route('student.face-recognition.index')}>Register Face</Link>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="@container/main flex flex-1 flex-col gap-4 p-6">
                <h1 className="mb-2 text-2xl font-semibold">
                    Welcome, <span className="text-primary capitalize">{user.name}</span>!
                </h1>
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>OJT Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-primary text-xs dark:text-gray-50">OJT Hours</h2>
                                    <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                        {Math.floor(completedHours)}/{Math.floor(requiredHoursNum)}
                                    </p>
                                </div>
                                <Clock className="h-12 w-12" strokeWidth={1} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Info</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold">{companyData?.company_name ?? 'No Company Submitted'}</h2>
                                <p className="text-xs capitalize">Status: {companyData?.status ?? 'No Company Submitted'}</p>
                            </div>
                            <Building className="h-12 w-12" strokeWidth={1} />
                        </CardContent>
                        <CardFooter className="h-full items-end">
                            <Link href={route('student.company.index')} className="w-full cursor-pointer">
                                <Button variant="outline" className="w-full">
                                    View/Edit Company
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Latest Announcements</CardTitle>
                        </CardHeader>
                        {announcements.length > 0 ? (
                            announcements.map((announcement) => (
                                <CardContent className="flex flex-col gap-2" key={announcement.id}>
                                    <div className="flex w-full items-center justify-between">
                                        <h2 className="font-bold">{announcement.title}</h2>
                                        <p className="text-xs">{format(parseISO(announcement.created_at), 'MM/dd/yyyy')}</p>
                                    </div>
                                </CardContent>
                            ))
                        ) : (
                            <CardContent className="flex flex-col gap-2">
                                <p className="text-muted-foreground text-sm">No announcements yet.</p>
                            </CardContent>
                        )}
                        <CardFooter className="h-full items-end">
                            <Link href={route('student.announcements.index')} className="w-full cursor-pointer">
                                <Button variant="outline" className="w-full">
                                    View Announcements
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>My Logs</CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col">
                            {timeRecords.length > 0 ? (
                                timeRecords.map((timeRecord) => (
                                    <div className="flex items-center gap-2" key={timeRecord.id}>
                                        <h2 className="font-bold">Last Log: {format(parseISO(timeRecord.time_in), 'MM/dd/yyyy')}</h2>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-muted-foreground text-sm">No logs yet.</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <h2 className="font-bold">Total Logs: {totalTimeRecords}</h2>
                            </div>
                        </CardContent>
                        <CardFooter className="h-full items-end">
                            <Link href={route('student.time-records.index')} className="w-full">
                                <Button variant="outline" className="w-full">
                                    <Plus className="h-4 w-4" />
                                    Submit New Log
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
