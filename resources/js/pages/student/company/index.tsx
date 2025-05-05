import CompanySubmissionForm from '@/components/company-submission-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { Head } from '@inertiajs/react';

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
    };
}

export default function Company({ companySubmission }: CompanySubmissionProps) {
    const isDialogOpen = companySubmission === null;

    const companyData = companySubmission;
    console.log(companyData);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="@container/main flex flex-1 flex-col gap-4 p-6">
                {isDialogOpen && <CompanySubmissionForm isDialogOpen={isDialogOpen} />}
                <h1>Company: {companyData.company_name} </h1>
                <p>Address: {companyData.company_address}</p>
                <p>Supervisor Name: {companyData.supervisor_name}</p>
                <p>Supervisor Contact: {companyData.supervisor_contact}</p>
                <p>Submitted At: {formatDate(companyData.submitted_at)}</p>
            </div>
        </AppLayout>
    );
}
