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
import { Loader2, MoreVerticalIcon, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
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
    users: PaginatedData<{
        id: number;
        name: string;
        email: string;
        role: 'teacher' | 'admin';
        department_id: number | null;
        department?: { id: number; name: string; code: string };
    }>;
    departments: Department[];
    params: {
        search?: string;
        role?: string;
        department_id?: string;
        page?: number;
        per_page?: number;
    };
}

export default function Index({ users, departments, params }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.search || '');
    const [role, setRole] = useState(params.role || '');
    const [departmentId, setDepartmentId] = useState(params.department_id || '');
    const [isLoaded, setIsLoaded] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: number; name: string; email: string } | null>(null);
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
            performSearch(value, role, departmentId);
        }, 500);
    };

    const handleRoleChange = (value: string) => {
        setRole(value);
        performSearch(searchTerm, value, departmentId);
    };

    const handleDepartmentChange = (value: string) => {
        setDepartmentId(value);
        performSearch(searchTerm, role, value);
    };

    const performSearch = (term: string, roleFilter: string, deptId: string) => {
        setIsLoading(true);
        const searchParams: Record<string, any> = { page: 1 };
        if (term) searchParams.search = term;
        if (roleFilter) searchParams.role = roleFilter;
        if (deptId) searchParams.department_id = deptId;

        router.get(route('users.index'), searchParams, {
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

        performSearch(searchTerm, role, departmentId);
    };

    const handleBlur = () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm, role, departmentId);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setRole('');
        setDepartmentId('');
        setIsLoading(true);

        router.get(
            route('users.index'),
            { page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const confirmDelete = (user: { id: number; name: string; email: string }) => {
        // First set the user, then show modal to avoid race conditions
        setUserToDelete(user);
        setTimeout(() => {
            setShowDeleteModal(true);
        }, 0);
    };

    const deleteUserConfirmed = () => {
        if (!userToDelete) return;

        const userId = userToDelete.id;
        setIsLoading(true);

        router.delete(route('users.destroy', userId), {
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
                    setUserToDelete(null);
                }, 100);
            },
            preserveScroll: true,
        });
    };

    const getRoleBadgeVariant = (role: string) => {
        return role === 'admin' ? 'destructive' : 'secondary';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>Manage your users here.</CardDescription>
                        </CardHeader>
                        <Button variant="outline" className="mx-4">
                            <Link href={route('users.create')} className="w-full">
                                Add User
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
                                        placeholder="Search users..."
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
                                                performSearch('', role, departmentId);
                                            }}
                                            className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
                                            aria-label="Clear search"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="min-w-[150px]">
                                    {' '}
                                    <Select value={role} onValueChange={handleRoleChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="teacher">Teacher</SelectItem>
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
                                            {departments.data.map((dept) => (
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
                                        disabled={isLoading || (!searchTerm && !role && !departmentId)}
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
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="w-[50px] font-medium">{user.id}</TableCell>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                                                </TableCell>
                                                <TableCell>{user.department ? `${user.department.name} (${user.department.code})` : '-'}</TableCell>
                                                {/* Actions */}
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
                                                                <Link href={route('users.show', user.id)}>View</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('users.edit', user.id)}>Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => confirmDelete(user)}>Delete</DropdownMenuItem>
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
                                <CustomPagination links={users.meta.links} />
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
                        setUserToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-medium">{userToDelete?.name}</span> ({userToDelete?.email})? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isLoading}
                            onClick={() => {
                                setShowDeleteModal(false);
                                setUserToDelete(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={deleteUserConfirmed} disabled={isLoading}>
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
