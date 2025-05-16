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
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { GraduationCap, Loader2, MoreVerticalIcon, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Student Groups',
        href: '/student-groups',
    },
];

interface Department {
    id: number;
    name: string;
    code: string;
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
    studentGroups: PaginatedData<{
        id: number;
        name: string;
        description: string | null;
        year_level: number | null;
        section: string | null;
        department_id: number;
        department?: { id: number; name: string; code: string };
        students_count?: number;
    }>;
    departments: Department[];
    params: {
        search?: string;
        department_id?: string;
        page?: number;
        per_page?: number;
    };
}

export default function StudentGroupsIndex({ studentGroups, departments, params }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.search || '');
    const [departmentId, setDepartmentId] = useState(params.department_id || '');
    const [isLoaded, setIsLoaded] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentGroupToDelete, setStudentGroupToDelete] = useState<{ id: number; name: string; department?: { code: string } } | null>(null);
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

    // Update state when params change
    useEffect(() => {
        setSearchTerm(params.search || '');
        setDepartmentId(params.department_id || '');
    }, [params]);

    const handleDepartmentChange = (value: string) => {
        setDepartmentId(value);
        performSearch(searchTerm, value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value, departmentId);
        }, 500);
    };

    const performSearch = (term: string, deptId: string) => {
        setIsLoading(true);
        const searchParams: Record<string, any> = { page: 1 };
        if (term) searchParams.search = term;
        if (deptId) searchParams.department_id = deptId;

        router.get(route('student-groups.index'), searchParams, {
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

        performSearch(searchTerm, departmentId);
    };

    const handleBlur = () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm, departmentId);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDepartmentId('');
        setIsLoading(true);

        router.get(
            route('student-groups.index'),
            { page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const confirmDelete = (group: { id: number; name: string; department?: { code: string } }) => {
        // First set the group, then show modal to avoid race conditions
        setStudentGroupToDelete(group);
        setTimeout(() => {
            setShowDeleteModal(true);
        }, 0);
    };

    const deleteStudentGroupConfirmed = () => {
        if (!studentGroupToDelete) return;

        const groupId = studentGroupToDelete.id;
        setIsLoading(true);

        router.delete(route('student-groups.destroy', groupId), {
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
                    setStudentGroupToDelete(null);
                }, 100);
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Groups" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>Student Groups</CardTitle>
                            <CardDescription>Manage student groups and their details.</CardDescription>
                        </CardHeader>
                        <Button variant="outline" className="mx-4">
                            <Link href={route('student-groups.create')} className="w-full">
                                Add Student Group
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
                                        placeholder="Search student groups..."
                                        className="pr-10 pl-8"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onBlur={handleBlur}
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchTerm('');
                                                performSearch('', departmentId);
                                            }}
                                            className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
                                            aria-label="Clear search"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="min-w-[200px]">
                                    <Select value={departmentId} onValueChange={handleDepartmentChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                                    {dept.name} ({dept.code})
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
                                        disabled={isLoading || (!searchTerm && !departmentId)}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <div className="rounded-md border px-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="hidden max-w-[200px] lg:table-cell">Description</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentGroups.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No student groups found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        studentGroups.data.map((group) => (
                                            <TableRow key={group.id}>
                                                <TableCell className="w-[50px] font-medium">{group.id}</TableCell>
                                                <TableCell>{group.name}</TableCell>
                                                <TableCell>
                                                    {group.department && (
                                                        <Badge variant="outline" className="font-semibold">
                                                            {group.department.code}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="hidden max-w-[200px] text-wrap lg:table-cell">
                                                    {group.description && group.description.length > 50
                                                        ? `${group.description.substring(0, 50)}...`
                                                        : group.description || '-'}
                                                </TableCell>
                                                
                                                <TableCell className="text-right">
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
                                                                <Link href={route('student-groups.edit', group.id)}>Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => confirmDelete(group)}>Delete</DropdownMenuItem>
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
                                <CustomPagination links={studentGroups.meta.links} />
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
                        setStudentGroupToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student Group</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-medium">{studentGroupToDelete?.name}</span>
                            {studentGroupToDelete?.department && ` (${studentGroupToDelete.department.code})`}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isLoading}
                            onClick={() => {
                                setShowDeleteModal(false);
                                setStudentGroupToDelete(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={deleteStudentGroupConfirmed} disabled={isLoading}>
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
