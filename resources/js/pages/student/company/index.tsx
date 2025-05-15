import CompanySubmissionForm from '@/components/company-submission-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle2, Clock, MapPin, Pencil, Phone, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company',
        href: '/student/company/',
    },
];

interface CompanySubmissionProps {
    companySubmission: {
        id: number;
        company_name: string;
        company_address: string;
        supervisor_name: string;
        supervisor_contact: number;
        submitted_at: string;
        status: string;
    };
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export default function Company({ companySubmission }: CompanySubmissionProps) {
    const isDialogOpen = companySubmission === null;
    const companyData = companySubmission;

    function getVariant(status: string): BadgeVariant {
        switch (status) {
            case 'approved':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'rejected':
                return 'destructive';
            default:
                return 'outline'; // fallback
        }
    }
    function getIcon(status: string) {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="mr-1 h-3.5 w-3.5" />;
            case 'pending':
                return <Clock className="mr-1 h-3.5 w-3.5" />;
            case 'rejected':
                return <AlertCircle className="mr-1 h-3.5 w-3.5" />;
            default:
                return ''; // fallback
        }
    }

    const statusBadge: {
        variant: BadgeVariant;
        icon: React.ReactNode;
    } = {
        variant: getVariant(companyData.status),
        icon: getIcon(companyData.status),
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Company | Student" />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                {isDialogOpen && <CompanySubmissionForm isDialogOpen={isDialogOpen} />}
                <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
                    <CardHeader>
                        <div className="flex flex-col items-start justify-between">
                            <div className="flex w-full items-center justify-between">
                                <CardTitle className="text-2xl font-bold tracking-tight">{companyData.company_name}</CardTitle>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant={statusBadge.variant}
                                        className="ml-2 flex items-center px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-200"
                                    >
                                        {statusBadge.icon}
                                        {companyData.status}
                                    </Badge>
                                    {companyData.status === 'rejected' ||
                                        (companyData.status === 'pending' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2"
                                                onClick={() => router.visit(route('student.company.edit'))}
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit Submission
                                            </Button>
                                        ))}
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm">Company Information</p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-6">
                            <div className="group flex items-start">
                                <MapPin className="text-muted-foreground group-hover:text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200" />
                                <div>
                                    <p className="text-muted-foreground mb-1.5 text-sm font-medium">Company Address</p>
                                    <p className="text-base leading-relaxed">{companyData.company_address}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="group flex items-start">
                                <User className="text-muted-foreground group-hover:text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200" />
                                <div>
                                    <p className="text-muted-foreground mb-1.5 text-sm font-medium">Supervisor</p>
                                    <p className="text-base leading-relaxed">{companyData.supervisor_name}</p>
                                </div>
                            </div>

                            <div className="group flex items-start">
                                <Phone className="text-muted-foreground group-hover:text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200" />
                                <div>
                                    <p className="text-muted-foreground mb-1.5 text-sm font-medium">Contact</p>
                                    <p className="text-base leading-relaxed">{companyData.supervisor_contact}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="group flex items-start">
                            <Calendar className="text-muted-foreground group-hover:text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200" />
                            <div>
                                <p className="text-muted-foreground mb-1.5 text-sm font-medium">Submitted At</p>
                                <p className="text-base leading-relaxed">{formatDate(companyData.submitted_at)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
