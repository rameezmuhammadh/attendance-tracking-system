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
        title: 'Users',
        href: '/users',
    },
    {
        title: 'User Details',
        href: '#',
    },
];

export default function Show({ user }: any) {
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'teacher':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Main User Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Name</span>
                                        <span className="text-base">{user.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Email</span>
                                        <span className="text-base">{user.email}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Role</span>
                                        <span className="text-base">
                                            <Badge className={getRoleBadgeColor(user.role)}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </Badge>
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Department</span>
                                        <span className="text-base">{user.department ? user.department.name : 'Not assigned'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500">Created</span>
                                        <span className="text-base">{user.created_at}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Information */}
                    {user.role === 'teacher' && user.subjects && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Assigned Subjects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.subjects.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Subject Name</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {user.subjects.map((subject: any) => (
                                                <TableRow key={subject.id}>
                                                    <TableCell className="font-medium">{subject.code}</TableCell>
                                                    <TableCell>{subject.name}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="py-4 text-center text-gray-500">No subjects assigned to this teacher.</div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
