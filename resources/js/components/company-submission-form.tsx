import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('student.company.store')); // Make sure this route exists
    };

    return (
        <Dialog open={isDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Company Submission Form</DialogTitle>
                    <DialogDescription>Please fill out this form to submit your company details.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        value={data.company_name}
                        onChange={(e) => setData('company_name', e.target.value)}
                        placeholder="Company Name"
                    />
                    {errors.company_name && <p className="text-red-500">{errors.company_name}</p>}
                    <Input
                        type="text"
                        value={data.company_address}
                        onChange={(e) => setData('company_address', e.target.value)}
                        placeholder="Company Address"
                    />
                    {errors.company_address && <p className="text-red-500">{errors.company_address}</p>}
                    <Input
                        type="text"
                        value={data.supervisor_name}
                        onChange={(e) => setData('supervisor_name', e.target.value)}
                        placeholder="Supervisor Name"
                    />
                    {errors.supervisor_name && <p className="text-red-500">{errors.supervisor_name}</p>}
                    <Input
                        type="tel"
                        value={data.supervisor_contact}
                        onChange={(e) => setData('supervisor_contact', e.target.value)}
                        placeholder="Supervisor Contact Number"
                    />
                    {errors.supervisor_contact && <p className="text-red-500">{errors.supervisor_contact}</p>}
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
