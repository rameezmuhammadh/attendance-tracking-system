import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Department {
    id: number;
    name: string;
    code: string;
}

interface Subject {
    id: number;
    name: string;
    code: string;
    description: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    department_id: number | null;
    department?: Department;
    subject_ids?: number[];
}

interface Props {
    user: User;
    departments: Department[];
    subjects: Subject[];
}

export default function Edit({ user, departments, subjects }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: 'Edit User',
            href: `/users/${user.id}/edit`,
        },
    ];
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'teacher',
        department_id: user.department_id ? user.department_id.toString() : '',
        subject_ids: user.subject_ids || [],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit User: {user.name}</CardTitle>
                        <CardDescription>Update user information below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                        <Label htmlFor="password">
                                            Password <span className="text-muted-foreground text-sm">(leave blank to keep current)</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                tabIndex={3}
                                                autoComplete="new-password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                disabled={processing}
                                                placeholder="New password (optional)"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-0 right-0 h-full px-3"
                                                onClick={togglePasswordVisibility}
                                                disabled={!data.password}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirm Password <span className="text-muted-foreground text-sm">(if changing password)</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                disabled={processing}
                                                placeholder="Confirm new password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-0 right-0 h-full px-3"
                                                onClick={toggleConfirmPasswordVisibility}
                                                disabled={!data.password_confirmation}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select value={data.role} onValueChange={(value: string) => setData('role', value)} disabled={processing}>
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="teacher">Teacher</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>
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
                                                {' '}
                                                {departments.data.map((department: Department) => (
                                                    <SelectItem key={department.id} value={department.id.toString()}>
                                                        {department.name} ({department.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.department_id} />
                                    </div>{' '}
                                </div>

                                {/* Subject selection for teachers */}
                                {data.role === 'teacher' && (
                                    <div className="mt-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="subject_ids">
                                                Subjects <span className="text-sm text-gray-500">(Maximum 3)</span>
                                            </Label>
                                            <div className="grid grid-cols-3 gap-2 rounded-md border p-4">
                                                {subjects.data.map((subject) => (
                                                    <div key={subject.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`subject-${subject.id}`}
                                                            checked={data.subject_ids.includes(subject.id)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    if (data.subject_ids.length < 3) {
                                                                        setData('subject_ids', [...data.subject_ids, subject.id]);
                                                                    }
                                                                } else {
                                                                    setData(
                                                                        'subject_ids',
                                                                        data.subject_ids.filter((id) => id !== subject.id),
                                                                    );
                                                                }
                                                            }}
                                                            disabled={
                                                                processing || (data.subject_ids.length >= 3 && !data.subject_ids.includes(subject.id))
                                                            }
                                                        />
                                                        <Label htmlFor={`subject-${subject.id}`} className="cursor-pointer">
                                                            {subject.name} ({subject.code})
                                                        </Label>
                                                    </div>
                                                ))}
                                                {subjects.length === 0 && <p className="text-sm text-gray-500">No subjects available</p>}
                                            </div>
                                            <InputError message={errors.subject_ids} />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex items-center justify-end gap-4">
                                    <Button variant="outline" className="mt-2" disabled={processing}>
                                        <Link href={route('users.index')} className="w-full">
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
