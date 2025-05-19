import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useForm } from '@inertiajs/react';

interface CompanySubmissionFormProps {
    isDialogOpen: boolean;
}

export default function CompanySubmissionForm({ isDialogOpen }: CompanySubmissionFormProps) {
    const { data, setData, processing, errors, post } = useForm({
        company_name: '',
        company_address: '',
        supervisor_name: '',
        supervisor_contact: '',
        moa_path: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('student.company.store'), {
            forceFormData: true,
        });
    };

    return (
        <Dialog open={isDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Company Submission Form</DialogTitle>
                    <DialogDescription>Please fill out this form to submit your company details.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="company_name">Company Name</Label>
                        <Input
                            id="company_name"
                            type="text"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            placeholder="Enter company name"
                        />
                        {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company_address">Company Address</Label>
                        <Input
                            id="company_address"
                            type="text"
                            value={data.company_address}
                            onChange={(e) => setData('company_address', e.target.value)}
                            placeholder="Enter company address"
                        />
                        {errors.company_address && <p className="text-sm text-red-500">{errors.company_address}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="supervisor_name">Supervisor Name</Label>
                        <Input
                            id="supervisor_name"
                            type="text"
                            value={data.supervisor_name}
                            onChange={(e) => setData('supervisor_name', e.target.value)}
                            placeholder="Enter supervisor name"
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
                            placeholder="Enter supervisor contact number"
                        />
                        {errors.supervisor_contact && <p className="text-sm text-red-500">{errors.supervisor_contact}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="moa_path">Memorandum of Agreement (MOA)</Label>
                        <Input
                            id="moa_path"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setData('moa_path', e.target.files?.[0] || null)}
                            className="cursor-pointer"
                        />
                        {errors.moa_path && <p className="text-sm text-red-500">{errors.moa_path}</p>}
                        <p className="text-muted-foreground text-xs">MOA document is optional and can be provided later.</p>
                    </div>

                    <DialogFooter className="flex justify-between pt-4">
                        <Link href={route('student.dashboard')}>
                            <Button variant="outline" type="button">
                                Back
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
