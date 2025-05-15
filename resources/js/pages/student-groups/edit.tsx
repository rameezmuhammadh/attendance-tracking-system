import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
    department_id: number;
    description: string | null;
}

interface Props {
    studentGroup: StudentGroup;
    departments: Department[];
}

export default function StudentGroupEdit({ studentGroup, departments }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Student Groups',
            href: '/student-groups',
        },
        {
            title: 'Edit',
            href: `/student-groups/${studentGroup.id}/edit`,
        },
    ];
    const { data, setData, put, processing, errors, reset } = useForm({
        name: studentGroup.name || '',
        department_id: studentGroup.department_id || '',
        description: studentGroup.description || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('student-groups.update', studentGroup.id));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Update Student Groups</CardTitle>
                        <CardDescription>Fill in the form below to update the Student Group.</CardDescription>
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
                                        <Label htmlFor="department">Department</Label>
                                        <Select
                                            value={data.department_id.toString()}
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
                                </div>
                                <div className="mt-4 grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        disabled={processing}
                                        placeholder="Description..."
                                        className="bg-background"
                                    />

                                    <InputError message={errors.description} />
                                </div>
                                <div className="mt-4 flex items-center justify-end gap-4">
                                    <Button variant="outline" className="mt-2" disabled={processing}>
                                        <Link href={route('student-groups.index')} className="w-full">
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button type="submit" className="mt-2" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Create
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
