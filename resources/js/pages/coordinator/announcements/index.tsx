import PaginationComponent from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import type { Announcements } from '@/types';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { truncateText } from '@/utils/string';
import { Head, useForm } from '@inertiajs/react';
import { Eye, Pencil } from 'lucide-react';
import { FormEvent, FormEventHandler, useState } from 'react';

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Announcements',
        href: '/coordinator/announcements',
    },
];

export default function Announcements({ announcements }: { announcements: PaginatedResponse<Announcements['data'][0]> }) {
    const [isAddModal, setIsAddModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body: '',
        type: 'announcement',
    });

    const addModal = (e: FormEvent) => {
        e.preventDefault();
        console.log('Add Modal Opened');
        setIsAddModal(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('coordinator.announcements.store'), {
            onSuccess: () => {
                setIsAddModal(false);
                setData({
                    title: '',
                    body: '',
                    type: 'announcement',
                });
            },
            onError: (errors) => {
                console.error('Error:', errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between">
                    <div>
                        <h1 className="font-bold">Announcements</h1>
                        <p className="text-muted-foreground text-sm">Manage your announcements here.</p>
                    </div>
                    <Button variant="outline" onClick={addModal}>
                        Create Announcement
                    </Button>
                </div>
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            <TableRow>
                                <TableHead className="w-[120px]">Type</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Body</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Program</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {announcements.data.map((announcement) => (
                                <TableRow key={announcement.id}>
                                    <TableCell>{announcement.type}</TableCell>
                                    <TableCell>{announcement.title}</TableCell>
                                    <TableCell>{truncateText(announcement.body)}</TableCell>
                                    <TableCell>{announcement.department.name}</TableCell>
                                    <TableCell>{announcement.program.name}</TableCell>
                                    <TableCell>{formatDate(announcement.created_at)}</TableCell>
                                    <TableCell className="w-[100px]">
                                        <div className="flex items-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-white">View</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="sm" variant="outline">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-white">Edit</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <PaginationComponent
                    links={announcements.links}
                    prevPageUrl={announcements.prev_page_url}
                    nextPageUrl={announcements.next_page_url}
                    currentPage={announcements.current_page}
                    lastPage={announcements.last_page}
                />

                <Dialog open={isAddModal} onOpenChange={setIsAddModal}>
                    <DialogContent>
                        <form onSubmit={submit} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Add Announcement/Reminder</DialogTitle>
                                <DialogDescription>
                                    Create a new announcement or reminder for students in your department and program.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-2 flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        id="title"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        placeholder="Title"
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="body">Body</Label>
                                    <Textarea
                                        id="body"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        required
                                        tabIndex={2}
                                        placeholder="Body"
                                        rows={4}
                                    />
                                    {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="status">Type of Announcement</Label>
                                    <Select value={data.type} onValueChange={(e) => setData('type', e)} defaultValue="announcement" required>
                                        <SelectTrigger id="status" className="col-span-3 w-full capitalize">
                                            <SelectValue placeholder="Select type of Announcement" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="announcement">Announcement</SelectItem>
                                            <SelectItem value="reminder">Reminder</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                </div>
                            </div>
                            <DialogFooter className="mt-4">
                                <Button type="submit" className="text-white" disabled={processing}>
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
