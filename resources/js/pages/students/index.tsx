import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CustomPagination from '@/components/ui/custom-pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building, Calendar, GraduationCap, Loader2, MoreVerticalIcon, Search, X } from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Students',
        href: '/students',
    },
];

interface Department {
    id: number;
    name: string;
    code: string;
}

interface StudentGroup {
    id: number;
    name: string;
}

interface PaginatedData<T> {
    data: T[];
    links: any[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: any[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

interface Props {
    students: PaginatedData<{
        id: number;
        registration_number: string;
        first_name: string;
        last_name: string;
        full_name: string;
        email: string;
        is_first_year: boolean;
        department_id: number;
        student_group_id: number;
        department?: { id: number; name: string; code: string };
        student_group?: { id: number; name: string };
    }>;
    departments: Department[];
    studentGroups: StudentGroup[];
    params: {
        search?: string;
        is_first_year?: string;
        department_id?: string;
        student_group_id?: string;
        page?: number;
        per_page?: number;
    };
}

export default function Index({ students, departments, studentGroups, params }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.search || '');
    const [isFirstYear, setIsFirstYear] = useState(params.is_first_year || '');
    const [departmentId, setDepartmentId] = useState(params.department_id || '');
    const [studentGroupId, setStudentGroupId] = useState(params.student_group_id || '');
    const [isLoaded, setIsLoaded] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<{ id: number; full_name: string; email: string } | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Set isLoaded to true after component mounts for animations
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value, isFirstYear, departmentId, studentGroupId);
        }, 500);
    };

    const handleFirstYearChange = (value: string) => {
        setIsFirstYear(value);
        performSearch(searchTerm, value, departmentId, studentGroupId);
    };

    const handleDepartmentChange = (value: string) => {
        setDepartmentId(value);
        performSearch(searchTerm, isFirstYear, value, studentGroupId);
    };

    const handleStudentGroupChange = (value: string) => {
        setStudentGroupId(value);
        performSearch(searchTerm, isFirstYear, departmentId, value);
    };

    const performSearch = (term: string, yearFilter: string, deptId: string, groupId: string) => {
        setIsLoading(true);
        const searchParams: Record<string, any> = { page: 1 };
        if (term) searchParams.search = term;
        if (yearFilter) searchParams.is_first_year = yearFilter;
        if (deptId) searchParams.department_id = deptId;
        if (groupId) searchParams.student_group_id = groupId;

        router.get(route('students.index'), searchParams, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm, isFirstYear, departmentId, studentGroupId);
    };

    const handleBlur = () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm, isFirstYear, departmentId, studentGroupId);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setIsFirstYear('');
        setDepartmentId('');
        setStudentGroupId('');
        setIsLoading(true);

        router.get(
            route('students.index'),
            { page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const confirmDelete = (student: { id: number; full_name: string; email: string }) => {
        // First set the student, then show modal to avoid race conditions
        setStudentToDelete(student);
        setTimeout(() => {
            setShowDeleteModal(true);
        }, 0);
    };

    const deleteStudentConfirmed = () => {
        if (!studentToDelete) return;

        const studentId = studentToDelete.id;
        setIsLoading(true);

        router.delete(route('students.destroy', studentId), {
            onSuccess: () => {
                // Success handling if needed
            },
            onError: () => {
                // Error handling if needed
            },
            onFinish: () => {
                setIsLoading(false);
                setShowDeleteModal(false);
                // Delay the state reset slightly to ensure the modal closes first
                setTimeout(() => {
                    setStudentToDelete(null);
                }, 100);
            },
            preserveScroll: true,
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        performSearch('', isFirstYear, departmentId, studentGroupId);
    };

    const getYearBadgeVariant = (isFirstYear: boolean) => {
        return isFirstYear ? 'secondary' : 'default';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>Students</CardTitle>
                            <CardDescription>Manage your students here.</CardDescription>
                        </CardHeader>
                        <Button variant="outline" className="mx-4">
                            <Link href={route('students.create')} className="w-full">
                                Add Student
                            </Link>
                        </Button>
                    </div>
                    <CardContent>
                        <div className="mb-6">
                            <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 md:flex-nowrap">
                                <div className="relative min-w-[200px] flex-1">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                    <Input
                                        type="search"
                                        placeholder="Search students..."
                                        className="pr-10 pl-8"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onBlur={handleBlur}
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
                                            aria-label="Clear search"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="min-w-[150px]">
                                    {' '}
                                    <Select value={isFirstYear} onValueChange={handleFirstYearChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">First Year</SelectItem>
                                            <SelectItem value="0">Higher Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="min-w-[200px]">
                                    {' '}
                                    <Select value={departmentId} onValueChange={handleDepartmentChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.data.map((department) => (
                                                <SelectItem key={department.id} value={department.id.toString()}>
                                                    {department.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="min-w-[200px]">
                                    {' '}
                                    <Select value={studentGroupId} onValueChange={handleStudentGroupChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select student group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {studentGroups.data.map((group) => (
                                                <SelectItem key={group.id} value={group.id.toString()}>
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            'Search'
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearFilters}
                                        disabled={isLoading || (!searchTerm && !isFirstYear && !departmentId && !studentGroupId)}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reg. Number</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Student Group</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        students.data.map((student) => (
                                            <TableRow key={student.id} className="group">
                                                <TableCell className="font-medium">{student.registration_number}</TableCell>
                                                <TableCell>{student.full_name}</TableCell>
                                                <TableCell>{student.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getYearBadgeVariant(student.is_first_year)}>
                                                        {student.is_first_year ? (
                                                            <>
                                                                <Calendar className="mr-1 h-3 w-3" />
                                                                First Year
                                                            </>
                                                        ) : (
                                                            <>
                                                                <GraduationCap className="mr-1 h-3 w-3" />
                                                                Higher Year
                                                            </>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Building className="h-3 w-3" />
                                                        {student.department?.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{student.student_group?.name}</TableCell>

                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="text-muted-foreground data-[state=open]:bg-muted flex size-8"
                                                                size="icon"
                                                            >
                                                                <MoreVerticalIcon />
                                                                <span className="sr-only">Open menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-32">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('students.edit', student.id)}>Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => confirmDelete(student)}>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-end px-4 py-4">
                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                                </div>
                            ) : (
                                <CustomPagination links={students.meta.links} />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={showDeleteModal}
                onOpenChange={(open) => {
                    setShowDeleteModal(open);
                    // When closing without confirming delete, make sure we clean up
                    if (!open) {
                        setStudentToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-medium">{studentToDelete?.full_name}</span> (
                            {studentToDelete?.email})? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isLoading}
                            onClick={() => {
                                setShowDeleteModal(false);
                                setStudentToDelete(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={deleteStudentConfirmed} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>Delete</>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
