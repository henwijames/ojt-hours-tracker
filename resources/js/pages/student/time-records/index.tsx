import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, TimeRecord } from '@/types';
import { formatNumber } from '@/utils/number';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    };
    required_hours: number;
}

export default function TimeRecords({ timeRecords, required_hours }: PageProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [progress, setProgress] = useState(0);
    const { data, setData } = useForm({
        hours: required_hours,
    });

    const hours = required_hours;
    console.log(hours);
    useEffect(() => {
        setProgress(timeRecords.data.length);
    }, [timeRecords]);

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
                                        <p className="text-sm font-medium">Remaining Hours: {formatNumber(hours - timeRecords.data.length)}</p>
                                        <Progress value={progress} />
                                        <div className="flex justify-between">
                                            <p className="text-sm font-medium">{Number(progress)} hours completed</p>
                                            <p className="text-sm font-medium">{formatNumber(hours)} hours required</p>
                                        </div>
                                        <Label htmlFor="hours">Total Required Hours</Label>
                                        <Input
                                            id="hours"
                                            type="number"
                                            value={`${Number(data.hours)}`}
                                            onChange={(e) => setData('hours', Number(e.target.value))}
                                            placeholder="Enter hours"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center font-bold">Record Time Entry</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Popover>
                                            <PopoverTrigger id="date" asChild>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn('w-full justify-between text-left font-normal', !date && 'text-muted-foreground')}
                                                >
                                                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                                    <CalendarIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
