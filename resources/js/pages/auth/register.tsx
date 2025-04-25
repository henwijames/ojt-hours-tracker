import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
    student_id?: string;
    department_id?: string;
    program_id?: string;
};

type Department = {
    id: string;
    name: string;
    programs: { id: string; name: string }[];
};

interface Props {
    departments: Department[];
}

export default function Register({ departments }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        role: 'student',
        password: '',
        password_confirmation: '',
        student_id: '',
        department_id: '',
        program_id: '',
    });

    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (errors) => console.error(errors),
        });
    };

    const handleDepartmentChange = (value: string) => {
        setData('department_id', value);
        setData('program_id', ''); // Clear program when department changes

        // Find the department by id and update selectedDepartment
        const dept = departments.find((department) => department.id.toString() === value);
        setSelectedDepartment(dept || null); // Update the selected department
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select onValueChange={(value) => setData('role', value)} value={data.role} disabled={processing}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="coordinator">Coordinator</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    {data.role === 'student' && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="student_id">Student ID</Label>
                                <Input
                                    id="student_id"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    disabled={processing}
                                    placeholder="e.g., 2023-00001"
                                />
                                <InputError message={errors.student_id} />
                            </div>

                            {/* Department Selection */}
                            <div className="grid gap-2">
                                <Label htmlFor="department">Department</Label>
                                <Select
                                    onValueChange={handleDepartmentChange}
                                    value={data.department_id}
                                    disabled={processing || departments.length === 0}
                                >
                                    <SelectTrigger className="w-full">
                                        {/* Show the selected department's name */}
                                        <SelectValue placeholder="Select Department">
                                            {selectedDepartment ? selectedDepartment.name : 'Select a department'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((department) => (
                                            <SelectItem key={department.id} value={department.id.toString()}>
                                                {department.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.department_id} />
                            </div>

                            {/* Program Selection */}
                            {data.department_id && (
                                <div className="grid gap-2">
                                    <Label htmlFor="program">Program</Label>
                                    <Select onValueChange={(value) => setData('program_id', value)} value={data.program_id} disabled={processing}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select your program">
                                                {selectedDepartment?.programs.find((program) => program.id.toString() === data.program_id)?.name ||
                                                    'Select a program'}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedDepartment && selectedDepartment.programs.length > 0 ? (
                                                selectedDepartment.programs.map((program) => (
                                                    <SelectItem key={program.id} value={program.id.toString()}>
                                                        {program.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-gray-500">No programs available for this department</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.program_id} />
                                </div>
                            )}
                        </>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
