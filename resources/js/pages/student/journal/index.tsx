import PaginationComponent from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Journal } from '@/types';
import { truncateText } from '@/utils/string';
import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'OJT Journals',
        href: '/student/journal',
    },
];

interface PageProps {
    journals: {
        data: Journal[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: { label: string; url: string | null; active: boolean }[];
    };
}

export default function Journals({ journals }: PageProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: destroy,
    } = useForm<Journal>({
        id: 0,
        title: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('student.journals.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        destroy(route('student.journals.destroy', { id }), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Records" />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Journal Entry</CardTitle>
                            <CardDescription>Record your thoughts, experiences, and reflections</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        onChange={handleChange}
                                        placeholder="Enter a title for your entry"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Journal Entry</Label>
                                    <Textarea
                                        id="content"
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                        placeholder="Write your journal entry here..."
                                        className="min-h-[150px]"
                                        required
                                    />
                                    {errors.description && <p className="text-red-500">{errors.description}</p>}
                                </div>

                                <Button variant="default" type="submit" className="w-full md:w-auto" disabled={processing}>
                                    Save Entry
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Journal Entries</CardTitle>
                            <CardDescription>Browse through your memories and reflections</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {journals.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {journals.data.map((journal) => (
                                        <Card className="overflow-hidden" key={journal.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between">
                                                    <CardTitle className="text-lg">{journal.title}</CardTitle>
                                                    <div className="flex space-x-1">
                                                        <Link href={route('student.journals.edit', { id: journal.id })}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Pencil className="h-4 w-4" />
                                                                <span className="sr-only">Edit</span>
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleDelete(journal.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <CardDescription>
                                                    <p className="line-clamp-4 text-sm">{truncateText(journal.description, 50)}</p>
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground text-sm">{new Date(journal.date).toLocaleDateString()}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground py-6 text-center">No journal entries yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                {journals.data.length > 0 && (
                    <PaginationComponent
                        links={journals.links}
                        prevPageUrl={journals.prev_page_url}
                        nextPageUrl={journals.next_page_url}
                        currentPage={journals.current_page}
                        lastPage={journals.last_page}
                    />
                )}
            </div>
        </AppLayout>
    );
}
