import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Journal, Students } from '@/types';
import { truncateText } from '@/utils/string';
import { Head } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

interface PageProps {
    student: Students;
    journals: Journal[];
}

export default function Journals({ student, journals }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Students',
            href: '/coordinator/students',
        },
        {
            title: `${student.user.name}'s Journal Logs`,
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
                            {journals.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {journals.map((journal) => (
                                        <Card className="overflow-hidden" key={journal.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between">
                                                    <CardTitle className="text-lg">{journal.title}</CardTitle>
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
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
            </div>
        </AppLayout>
    );
}
