import PaginationComponent from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { acronymText } from '@/utils/string';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock, Download } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company Submissions',
        href: '/coordinator/company-submissions',
    },
];

interface CompanySubmission {
    id: number;
    company_name: string;
    company_address: string;
    supervisor_name: string;
    supervisor_contact: string;
    moa_path: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at: string;
    approved_at: string | null;
    rejected_at: string | null;
    student: {
        user: {
            name: string;
            email: string;
        };
        program: {
            name: string;
        };
    };
}

interface PageProps {
    companySubmissions: {
        data: CompanySubmission[];
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

export default function CompanySubmissions({ companySubmissions }: PageProps) {
    function getVariant(status: string | null): BadgeVariant {
        if (!status) return 'outline';

        switch (status) {
            case 'approved':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'rejected':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    function getIcon(status: string | null) {
        if (!status) return '';

        switch (status) {
            case 'approved':
                return <CheckCircle2 className="mr-1 h-3.5 w-3.5" />;
            case 'pending':
                return <Clock className="mr-1 h-3.5 w-3.5" />;
            case 'rejected':
                return <AlertCircle className="mr-1 h-3.5 w-3.5" />;
            default:
                return '';
        }
    }

    const handlePagination = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };

    const handleApprove = (id: number) => {
        router.put(route('coordinator.company-submissions.approve', id));
    };

    const handleReject = (id: number) => {
        router.put(route('coordinator.company-submissions.reject', id));
    };

    const handleViewMoa = (path: string) => {
        window.open(`/storage/${path}`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Company Submissions | Coordinator" />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                <div className="mx-auto w-full space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Company Submissions</h1>
                            <p className="text-muted-foreground mt-1 text-sm">Review and manage company submissions from your students.</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Program</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Supervisor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companySubmissions.data.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{submission.student.user.name}</p>
                                                <p className="text-muted-foreground text-sm">{submission.student.user.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{acronymText(submission.student.program.name)}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{submission.company_name}</p>
                                                <p className="text-muted-foreground text-sm">{submission.company_address}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{submission.supervisor_name}</p>
                                                <p className="text-muted-foreground text-sm">{submission.supervisor_contact}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getVariant(submission.status)}
                                                className="flex items-center px-2 py-1 text-xs font-medium capitalize"
                                            >
                                                {getIcon(submission.status)}
                                                {submission.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(submission.submitted_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="outline" onClick={() => handleViewMoa(submission.moa_path)}>
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Download MOA</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                {submission.status === 'pending' && (
                                                    <>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button size="sm" variant="outline" onClick={() => handleApprove(submission.id)}>
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Approve</p>
                                                            </TooltipContent>
                                                        </Tooltip>

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button size="sm" variant="outline" onClick={() => handleReject(submission.id)}>
                                                                    <AlertCircle className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Reject</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4">
                        <PaginationComponent
                            links={companySubmissions.links}
                            prevPageUrl={companySubmissions.prev_page_url}
                            nextPageUrl={companySubmissions.next_page_url}
                            currentPage={companySubmissions.current_page}
                            lastPage={companySubmissions.last_page}
                            handlePagination={handlePagination}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
