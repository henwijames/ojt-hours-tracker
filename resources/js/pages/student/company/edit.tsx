import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company',
        href: '/student/company',
    },
    {
        title: 'Edit Submission',
        href: '/student/company/edit',
    },
];

interface CompanySubmissionProps {
    companySubmission: {
        id: number;
        company_name: string;
        company_address: string;
        supervisor_name: string;
        supervisor_contact: string;
        moa_path: string;
    };
}

export default function EditCompany({ companySubmission }: CompanySubmissionProps) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: companySubmission.company_name,
        company_address: companySubmission.company_address,
        supervisor_name: companySubmission.supervisor_name,
        supervisor_contact: companySubmission.supervisor_contact,
        moa_path: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('student.company.update', companySubmission.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Company Submission | Student" />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.visit(route('student.company.index'))}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Edit Company Submission</h1>
                            <p className="text-muted-foreground mt-1 text-sm">Update your company submission details below.</p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name">Company Name</Label>
                                        <Input
                                            id="company_name"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            required
                                        />
                                        {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company_address">Company Address</Label>
                                        <Textarea
                                            id="company_address"
                                            value={data.company_address}
                                            onChange={(e) => setData('company_address', e.target.value)}
                                            required
                                        />
                                        {errors.company_address && <p className="text-sm text-red-500">{errors.company_address}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="supervisor_name">Supervisor Name</Label>
                                        <Input
                                            id="supervisor_name"
                                            value={data.supervisor_name}
                                            onChange={(e) => setData('supervisor_name', e.target.value)}
                                            required
                                        />
                                        {errors.supervisor_name && <p className="text-sm text-red-500">{errors.supervisor_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="supervisor_contact">Supervisor Contact</Label>
                                        <Input
                                            id="supervisor_contact"
                                            type="tel"
                                            value={data.supervisor_contact}
                                            onChange={(e) => setData('supervisor_contact', e.target.value)}
                                            required
                                        />
                                        {errors.supervisor_contact && <p className="text-sm text-red-500">{errors.supervisor_contact}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={() => router.visit(route('student.company.index'))}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Update Submission
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
