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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CustomPagination from '@/components/ui/custom-pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
        title: 'Departments',
        href: '/departments',
    },
];

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
    departments: PaginatedData<{ id: number; name: string; code: string; description: string }>;
    params: {
        search?: string;
        page?: number;
        per_page?: number;
    };
}

export default function Index({ departments, params }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.search || '');
    const [isLoaded, setIsLoaded] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState<{ id: number; name: string; code: string } | null>(null);
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
            performSearch(value);
        }, 500);
    };

    const performSearch = (term: string) => {
        setIsLoading(true);
        const searchParams: Record<string, any> = { page: 1 };
        if (term) searchParams.search = term;

        router.get(route('departments.index'), searchParams, {
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

        performSearch(searchTerm);
    };

    const handleBlur = () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm);
    };
    const clearSearch = () => {
        setSearchTerm('');
        setIsLoading(true);

        router.get(
            route('departments.index'),
            { page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };
    const confirmDelete = (department: { id: number; name: string; code: string }) => {
        // First set the department, then show modal to avoid race conditions
        setDepartmentToDelete(department);
        setTimeout(() => {
            setShowDeleteModal(true);
        }, 0);
    };

    const deleteDepartmentConfirmed = () => {
        if (!departmentToDelete) return;

        const departmentId = departmentToDelete.id;
        setIsLoading(true);

        router.delete(route('departments.destroy', departmentId), {
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
                    setDepartmentToDelete(null);
                }, 100);
            },
            preserveScroll: true,
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full">
                    {' '}
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>Departments</CardTitle>
                            <CardDescription>Manage your departments here.</CardDescription>
                        </CardHeader>
                        <Button variant="outline" className="mx-4">
                            <Link href={route('departments.create')} className="w-full">
                                Add Department
                            </Link>
                        </Button>
                    </div>
                    <CardContent>
                        {' '}
                        <div className="mb-6">
                            <form onSubmit={handleSearch} className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                    <Input
                                        type="search"
                                        placeholder="Search departments..."
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
                            </form>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead className="hidden max-w-[200px] lg:block">Description</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments.data.map((department) => (
                                    <TableRow key={department.id}>
                                        <TableCell className="w-[100px]">{department.id}</TableCell>
                                        <TableCell>{department.name}</TableCell>
                                        <TableCell>{department.code}</TableCell>
                                        <TableCell className="hidden max-w-[200px] text-wrap lg:block">
                                            {department.description?.length > 50
                                                ? `${department.description.substring(0, 50)}...`
                                                : department.description || 'No description'}
                                        </TableCell>
                                        {/* Actions */}
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
                                                </DropdownMenuTrigger>{' '}
                                                <DropdownMenuContent align="end" className="w-32">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('departments.edit', department.id)}>Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => confirmDelete(department)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>{' '}
                        </Table>
                        <div className="flex items-center justify-end px-4 py-2">
                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                                </div>
                            ) : (
                                <CustomPagination links={departments.meta.links} />
                            )}
                        </div>
                    </CardContent>
                </Card>{' '}
            </div>{' '}
            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={showDeleteModal}
                onOpenChange={(open) => {
                    setShowDeleteModal(open);
                    // When closing without confirming delete, make sure we clean up
                    if (!open) {
                        setDepartmentToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-medium">{departmentToDelete?.name}</span> (
                            {departmentToDelete?.code})? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isLoading}
                            onClick={() => {
                                setShowDeleteModal(false);
                                setDepartmentToDelete(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={deleteDepartmentConfirmed} disabled={isLoading}>
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
