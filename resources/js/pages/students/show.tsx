import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
        title: 'Student Details',
        href: '#',
    },
];

export default function Show({ student }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Student: ${student.full_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Main Student Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Registration Number</span>
                                        <span className="text-base font-medium">{student.registration_number}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Full Name</span>
                                        <span className="text-base">{student.full_name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Email</span>
                                        <span className="text-base">{student.email}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">First Year Student</span>
                                        <span className="text-base">
                                            <Badge className={student.is_first_year ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                {student.is_first_year ? 'Yes' : 'No'}
                                            </Badge>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Department & Group Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Department</span>
                                        <span className="text-base">{student.department?.name || 'Not assigned'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Student Group</span>
                                        <span className="text-base">{student.student_group?.name || 'Not assigned'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Registered On</span>
                                        <span className="text-base">{student.created_at}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enrolled Subjects */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Enrolled Subjects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {student.subjects && student.subjects.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Subject Name</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {student.subjects.map((subject: any) => (
                                            <TableRow key={subject.id}>
                                                <TableCell className="font-medium">{subject.code}</TableCell>
                                                <TableCell>{subject.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-4 text-center text-gray-500">No subjects enrolled yet.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Attendance Records */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {student.attendances && student.attendances.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {student.attendances.map((attendance: any) => (
                                            <TableRow key={attendance.id}>
                                                <TableCell>{attendance.date}</TableCell>
                                                <TableCell>{attendance.subject?.name || 'Unknown'}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            attendance.status === 'present'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }
                                                    >
                                                        {attendance.is_present ? 'Present' : 'Absent'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-4 text-center text-gray-500">No attendance records found.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
