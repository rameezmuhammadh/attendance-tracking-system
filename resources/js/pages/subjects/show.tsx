import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Subjects',
        href: '/subjects',
    },
    {
        title: 'Subject Details',
        href: '#',
    },
];

export default function Show() {
    const { subject } = usePage().props as any;

    // Debug props being received
    console.log('Subject props:', {
        subject,
        subjectTeachers: subject.teachers,
        subjectStudents: subject.students,
    });

    // Ensure teachers and students are arrays even if null/undefined
    const teachersArray = Array.isArray(subject.teachers) ? subject.teachers : [];
    const studentsArray = Array.isArray(subject.students) ? subject.students : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Subject: ${subject.code}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Main Subject Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Code</span>
                                        <span className="text-base font-medium">{subject.code}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Name</span>
                                        <span className="text-base">{subject.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Description</span>
                                        <span className="text-base">{subject.description || 'No description'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Created At</span>
                                        <span className="text-base">{subject.created_at}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>{' '}
                    {/* Associated Teachers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Teachers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {teachersArray.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Department</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teachersArray.map((teacher: any) => (
                                            <TableRow key={teacher.id}>
                                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                                <TableCell>{teacher.department ? teacher.department.name : 'Not assigned'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-4 text-center text-gray-500">No teachers assigned to this subject.</div>
                            )}
                        </CardContent>
                    </Card>{' '}
                    {/* Associated Students */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {studentsArray.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reg. Number</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Student Group</TableHead>
                                            <TableHead>Department</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {studentsArray.map((student: any) => (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-medium">{student.registration_number}</TableCell>
                                                <TableCell>{student.full_name}</TableCell>
                                                <TableCell>{student.student_group?.name || 'Not assigned'}</TableCell>
                                                <TableCell>{student.department?.name || 'Not assigned'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-4 text-center text-gray-500">No students enrolled in this subject.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
