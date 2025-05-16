import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CustomPagination from '@/components/ui/custom-pagination';
import { DatePicker } from '@/components/ui/date-picker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Loader2, MoreVerticalIcon, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Attendance',
        href: '/attendances',
    },
];

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

interface Student {
    id: number;
    registration_number: string;
    first_name: string;
    last_name: string;
    full_name: string;
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
    attendances: PaginatedData<{
        id: number;
        student_id: number;
        subject_id: number;
        date: string;
        is_present: boolean;
        subject?: Subject;
        student?: Student;
    }>;
    departments: Department[];
    subjects: Subject[];
    params: {
        search?: string;
        subject_id?: string;
        department_id?: string;
        is_present?: string;
        start_date?: string;
        end_date?: string;
        page?: number;
        per_page?: number;
    };
}

export default function Index({ attendances, departments, subjects, params }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.search || '');
    const [subjectId, setSubjectId] = useState(params.subject_id || '');
    const [departmentId, setDepartmentId] = useState(params.department_id || '');
    const [isPresent, setIsPresent] = useState(params.is_present || '');
    const [startDate, setStartDate] = useState<Date | undefined>(
        params.start_date ? new Date(params.start_date) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    );
    const [endDate, setEndDate] = useState<Date | undefined>(params.end_date ? new Date(params.end_date) : new Date());
    const [isLoaded, setIsLoaded] = useState(false);
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
            performSearch(value, subjectId, departmentId, isPresent, startDate, endDate);
        }, 500);
    };

    const handleSubjectChange = (value: string) => {
        setSubjectId(value);
        performSearch(searchTerm, value, departmentId, isPresent, startDate, endDate);
    };

    const handleDepartmentChange = (value: string) => {
        setDepartmentId(value);
        performSearch(searchTerm, subjectId, value, isPresent, startDate, endDate);
    };

    const handleIsPresentChange = (value: string) => {
        setIsPresent(value);
        performSearch(searchTerm, subjectId, departmentId, value, startDate, endDate);
    };

    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date);
        if (date) {
            performSearch(searchTerm, subjectId, departmentId, isPresent, date, endDate);
        }
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date);
        if (date) {
            performSearch(searchTerm, subjectId, departmentId, isPresent, startDate, date);
        }
    };

    const performSearch = (term: string, subjId: string, deptId: string, presence: string, start?: Date, end?: Date) => {
        setIsLoading(true);
        const searchParams: Record<string, any> = { page: 1 };
        if (term) searchParams.search = term;
        if (subjId) searchParams.subject_id = subjId;
        if (deptId) searchParams.department_id = deptId;
        if (presence) searchParams.is_present = presence;
        if (start) searchParams.start_date = format(start, 'yyyy-MM-dd');
        if (end) searchParams.end_date = format(end, 'yyyy-MM-dd');

        router.get(route('attendances.index'), searchParams, {
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

        performSearch(searchTerm, subjectId, departmentId, isPresent, startDate, endDate);
    };

    const handleBlur = () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm, subjectId, departmentId, isPresent, startDate, endDate);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSubjectId('');
        setDepartmentId('');
        setIsPresent('');
        // Reset date range to default (one week before to today)
        const newStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newEndDate = new Date();
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setIsLoading(true);

        router.get(
            route('attendances.index'),
            {
                page: 1,
                start_date: format(newStartDate, 'yyyy-MM-dd'),
                end_date: format(newEndDate, 'yyyy-MM-dd'),
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const getStatusBadgeVariant = (isPresent: boolean) => {
        return isPresent ? 'success' : 'destructive';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Records" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>Attendance Records</CardTitle>
                            <CardDescription>View and manage attendance records</CardDescription>
                        </CardHeader>
                        <Button variant="outline" className="mx-4">
                            <Link href={route('attendances.create')} className="w-full">
                                Mark Attendance
                            </Link>
                        </Button>
                    </div>
                    <CardContent>
                        <div className="mb-6">
                            <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3 md:flex-nowrap">
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
                                            onClick={() => {
                                                setSearchTerm('');
                                                performSearch('', subjectId, departmentId, isPresent, startDate, endDate);
                                            }}
                                            className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
                                            aria-label="Clear search"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-4">
                                    {/* Date range selectors */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm">Start Date</label>
                                        <DatePicker selected={startDate} onSelect={handleStartDateChange} maxDate={endDate} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm">End Date</label>
                                        <DatePicker selected={endDate} onSelect={handleEndDateChange} minDate={startDate} />
                                    </div>

                                    {/* Subject filter */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm">Subject</label>
                                        <Select value={subjectId} onValueChange={handleSubjectChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Subjects" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects.data.map((subject) => (
                                                    <SelectItem key={subject.id} value={subject.id.toString()}>
                                                        {subject.code} - {subject.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Department filter */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm">Department</label>
                                        <Select value={departmentId} onValueChange={handleDepartmentChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Departments" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.data.map((department) => (
                                                    <SelectItem key={department.id} value={department.id.toString()}>
                                                        {department.code} - {department.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Attendance status filter */}
                                <div className="min-w-[150px]">
                                    <label className="mb-1 text-sm">Status</label>
                                    <Select value={isPresent} onValueChange={handleIsPresentChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Present</SelectItem>
                                            <SelectItem value="0">Absent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex space-x-2">
                                    <Button type="submit">Search</Button>
                                    <Button type="button" variant="outline" onClick={clearFilters}>
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-10 text-center">
                                                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                            </TableCell>
                                        </TableRow>
                                    ) : attendances.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-10 text-center">
                                                No attendance records found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        attendances.data.map((attendance) => (
                                            <TableRow key={attendance.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{new Date(attendance.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    {attendance.student?.full_name}
                                                    <div className="text-muted-foreground text-xs">{attendance.student?.registration_number}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {attendance.subject?.name}
                                                    <div className="text-muted-foreground text-xs">{attendance.subject?.code}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={attendance.is_present ? 'success' : 'destructive'}>
                                                        {attendance.is_present ? 'Present' : 'Absent'}
                                                    </Badge>
                                                </TableCell>
                  
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4">
                            <CustomPagination links={attendances.meta.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
