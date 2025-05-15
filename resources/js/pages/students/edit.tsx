import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Department {
    id: number;
    name: string;
    code: string;
}

interface StudentGroup {
    id: number;
    name: string;
}

interface Student {
    id: number;
    registration_number: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    is_first_year: boolean;
    department_id: number;
    student_group_id: number;
    department?: Department;
    student_group?: StudentGroup;
}

interface Props {
    student: Student;
    departments: Department[];
    studentGroups: StudentGroup[];
}

export default function Edit({ student, departments, studentGroups }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Students',
            href: '/students',
        },
        {
            title: 'Edit Student',
            href: `/students/${student.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors, reset } = useForm({
        registration_number: student.registration_number || '',
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        is_first_year: student.is_first_year || false,
        department_id: student.department_id ? student.department_id.toString() : '',
        student_group_id: student.student_group_id ? student.student_group_id.toString() : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('students.update', student.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Student: ${student.full_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Student: {student.full_name}</CardTitle>
                        <CardDescription>Update student information below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="registration_number">Registration Number</Label>
                                        <Input
                                            id="registration_number"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.registration_number}
                                            onChange={(e) => setData('registration_number', e.target.value)}
                                            disabled={processing}
                                            placeholder="Student registration number"
                                        />
                                        <InputError message={errors.registration_number} className="mt-2" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="Email address"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input
                                            id="first_name"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            autoComplete="given-name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            disabled={processing}
                                            placeholder="First name"
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            required
                                            tabIndex={4}
                                            autoComplete="family-name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Last name"
                                        />
                                        <InputError message={errors.last_name} />
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Select
                                            value={data.department_id}
                                            onValueChange={(value) => setData('department_id', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="department">
                                                <SelectValue placeholder="Select a department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.data.map((department) => (
                                                    <SelectItem key={department.id} value={department.id.toString()}>
                                                        {department.name} ({department.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.department_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="student_group">Student Group</Label>
                                        <Select
                                            value={data.student_group_id}
                                            onValueChange={(value) => setData('student_group_id', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="student_group">
                                                <SelectValue placeholder="Select a student group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {studentGroups.data.map((group) => (
                                                    <SelectItem key={group.id} value={group.id.toString()}>
                                                        {group.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.student_group_id} />
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center space-x-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_first_year"
                                            name="is_first_year"
                                            className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                                            checked={data.is_first_year}
                                            onChange={(e) => setData('is_first_year', e.target.checked)}
                                            disabled={processing}
                                        />
                                        <Label htmlFor="is_first_year" className="ml-2 cursor-pointer">
                                            First Year Student
                                        </Label>
                                    </div>
                                    <InputError message={errors.is_first_year} />
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-4">
                                    <Button variant="outline" className="mt-2" disabled={processing}>
                                        <Link href={route('students.index')} className="w-full">
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button type="submit" className="mt-2" disabled={processing}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
