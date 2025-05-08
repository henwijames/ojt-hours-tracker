import PaginationComponent from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Bell, Calendar, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reminders',
        href: '/student/reminders',
    },
];

interface Reminders {
    id: number;
    title: string;
    body: string;
    type: 'reminder';
    department: {
        name: string;
    };
    program: {
        name: string;
    };
    created_at: string;
}

interface PageProps {
    reminders: {
        data: Reminders[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export default function Reminders({ reminders }: PageProps) {
    function getVariant(type: string): BadgeVariant {
        switch (type) {
            case 'reminder':
                return 'secondary';
            default:
                return 'outline';
        }
    }

    function getIcon(type: string) {
        switch (type) {
            case 'reminder':
                return <Clock className="mr-1 h-3.5 w-3.5" />;
            default:
                return <AlertCircle className="mr-1 h-3.5 w-3.5" />;
        }
    }

    const handlePagination = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reminders | Student" />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                <div className="w-full space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Reminders</h1>
                            <p className="text-muted-foreground mt-1 text-sm">Stay updated with the latest reminders from your department.</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {reminders.data.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Bell className="text-muted-foreground mb-4 h-12 w-12" />
                                    <p className="text-muted-foreground text-center text-sm">No reminders available at the moment.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            reminders.data.map((reminder) => (
                                <Card key={reminder.id} className="transition-all duration-200 hover:shadow-md">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-xl font-semibold">{reminder.title}</CardTitle>
                                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{formatDate(reminder.created_at)}</span>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={getVariant(reminder.type)}
                                                className="ml-2 flex items-center px-2 py-1 text-xs font-medium capitalize"
                                            >
                                                {getIcon(reminder.type)}
                                                {reminder.type}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{reminder.body}</p>
                                        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                                            <Badge variant="outline" className="font-normal">
                                                {reminder.department.name}
                                            </Badge>
                                            <Badge variant="outline" className="font-normal">
                                                {reminder.program.name}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {reminders.data.length > 0 && (
                        <PaginationComponent
                            links={reminders.links}
                            prevPageUrl={reminders.prev_page_url}
                            nextPageUrl={reminders.next_page_url}
                            currentPage={reminders.current_page}
                            lastPage={reminders.last_page}
                            handlePagination={handlePagination}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
