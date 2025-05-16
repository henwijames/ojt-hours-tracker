import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Journal } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Journal Logs',
        href: '/student/journals/',
    },
    {
        title: 'Edit Journal',
        href: '#',
    },
];

export default function EditJournal({ journal }: { journal: Journal }) {
    const { data, setData, processing, errors, reset, put } = useForm<Journal>({
        id: journal.id,
        title: journal.title,
        description: journal.description,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('student.journals.update', { id: journal.id }), {
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
                                    {processing ? 'Saving...' : 'Save Entry'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
