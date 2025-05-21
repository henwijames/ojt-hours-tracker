import PaginationComponent from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Students, TimeRecord } from '@/types';
import { formatNumber } from '@/utils/number';
import { printTimeRecord } from '@/utils/timerecordPrint';
import { Head, useForm } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Calendar, Loader2, Printer, XCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Records',
        href: '/student/time-records',
    },
];

interface PageProps {
    timeRecords: {
        data: TimeRecord[];
        current_page: number;
        last_page: number;
        links: { label: string; url: string | null; active: boolean }[];
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    required_hours: number;
    completed_hours: number;
    time_in: string;
    time_out: string | null;
    timeRecordToday: string | null;
    student: Students;
    auth: {
        user: {
            name: string;
        };
    };
}

type TimeInForm = {
    image: File | null;
};

export default function TimeRecords({ timeRecords, required_hours, completed_hours, time_in, time_out, timeRecordToday, student, auth }: PageProps) {
    const { setData, post, processing, errors } = useForm<TimeInForm>({
        image: null,
    });

    const user = auth.user;

    const [isTimeInOpen, setIsTimeInOpen] = useState(false);
    const [isTimeOutOpen, setIsTimeOutOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
        }

        if (!file || !file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file');
            if (fileRef.current) {
                fileRef.current.value = '';
            }
        }
    };

    const handleTimeInDialogClose = () => {
        setIsTimeInOpen(false);
        if (fileRef.current) {
            fileRef.current.value = '';
        }
        setData('image', null);
    };

    const handleTimeOutDialogClose = () => {
        setIsTimeOutOpen(false);
        if (fileRef.current) {
            fileRef.current.value = '';
        }
        setData('image', null);
    };

    const hours = required_hours || 0;
    const completed = completed_hours || 0;

    useEffect(() => {
        if (hours > 0) {
            const calculatedProgress = (completed / hours) * 100;
            setProgress(Math.min(Math.max(calculatedProgress, 0), 100));
        } else {
            setProgress(0);
        }
    }, [completed, hours]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeInSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('student.time-records.time-in'), {
            onSuccess: () => {
                handleTimeInDialogClose();
            },
            onError: () => {
                handleTimeInDialogClose();
            },
        });
    };

    const timeOutSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsTimeOutOpen(false);
        post(route('student.time-records.time-out'), {
            onSuccess: () => {
                handleTimeOutDialogClose();
            },
            onError: () => {
                handleTimeOutDialogClose();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Records" />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                <div className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center font-bold">OJT Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-medium">Remaining Hours: {formatNumber(Math.max(hours - completed, 0))}</p>
                                        <Progress value={progress} />
                                        <div className="flex justify-between">
                                            <p className="text-sm font-medium">{formatNumber(progress)}% completed</p>
                                            <p className="text-sm font-medium">{formatNumber(hours)} hours required</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center font-bold">Record Time Entry</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-grow flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-center text-2xl font-bold">{format(currentTime, 'hh:mm:ss a')}</h1>
                                    <div className="mt-auto flex justify-between">
                                        <p className="text-muted-foreground items-center">
                                            {timeRecordToday ? `Clocked In at ${format(parseISO(time_in), 'hh:mm:ss a')}` : 'Not Clocked In'}
                                        </p>
                                        {time_in !== null && time_out === null ? (
                                            <p className="text-muted-foreground items-center">Not Clocked Out Yet</p>
                                        ) : time_out !== null ? (
                                            <p className="text-muted-foreground items-center">
                                                Clocked Out at {format(parseISO(time_out), 'hh:mm:ss a')}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="mt-auto flex items-center gap-2">
                                    <Dialog open={isTimeInOpen} onOpenChange={setIsTimeInOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="default" className="flex-grow" disabled={time_in !== null}>
                                                Clock In
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Proof of Time In</DialogTitle>
                                                <DialogDescription>Submit an image as proof of attendance.</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={timeInSubmit}>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <Label htmlFor="picture">Picture</Label>
                                                    <Input
                                                        id="picture"
                                                        ref={fileRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        aria-label="Upload time in proof"
                                                    />
                                                    {errors.image && <p className="text-red-500">{errors.image}</p>}
                                                </div>
                                                <DialogFooter className="mt-2">
                                                    <Button type="submit" disabled={processing}>
                                                        Submit
                                                        {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog open={isTimeOutOpen} onOpenChange={setIsTimeOutOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex-grow" disabled={time_in === null || time_out !== null}>
                                                Clock Out
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Proof of Time Out</DialogTitle>
                                                <DialogDescription>Submit an image as proof of attendance.</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={timeOutSubmit}>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <Label htmlFor="picture">Picture</Label>
                                                    <Input
                                                        id="picture"
                                                        ref={fileRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        aria-label="Upload time out proof"
                                                    />
                                                    {errors.image && <p className="text-red-500">{errors.image}</p>}
                                                </div>
                                                <DialogFooter className="mt-2">
                                                    <Button type="submit" disabled={processing}>
                                                        Submit
                                                        {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button
                        onClick={() => printTimeRecord({ user, student, timeRecords, required_hours })}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Print Records
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                    {timeRecords.data.length > 0 ? (
                        timeRecords.data.map((timeRecord) => (
                            <div key={timeRecord.id}>
                                <Card className="flex flex-col gap-4 overflow-visible p-4 shadow-md">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-muted-foreground h-5 w-5" />
                                                <span className="font-semibold">Clock In:</span>
                                                <span className="text-muted-foreground">
                                                    {timeRecord.time_in
                                                        ? format(parseISO(timeRecord.time_in), 'MMMM dd, yyyy hh:mm:ss a')
                                                        : 'Not recorded'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-5 w-5 text-red-500" />
                                                <span className="font-semibold">Clock Out:</span>
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
                                                src={timeRecord.time_in_image}
                                                alt="Time in proof"
                                                className="h-32 w-32 rounded-lg border object-cover shadow-md"
                                            />
                                        )}
                                        {timeRecord.time_out_image && (
                                            <img
                                                src={timeRecord.time_out_image}
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
                            </div>
                        ))
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                            <p className="text-muted-foreground">No time records found</p>
                        </div>
                    )}
                </div>
                {timeRecords.data.length > 0 && (
                    <PaginationComponent
                        links={timeRecords.links}
                        prevPageUrl={timeRecords.prev_page_url}
                        nextPageUrl={timeRecords.next_page_url}
                        currentPage={timeRecords.current_page}
                        lastPage={timeRecords.last_page}
                    />
                )}
            </div>
        </AppLayout>
    );
}
