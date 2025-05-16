import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface Student {
    id: number;
    registration_number: string;
    first_name: string;
    last_name: string;
    full_name: string;
    attendance_status?: boolean | null;
}

interface Subject {
    id: number;
    name: string;
    code: string;
}

interface Teacher {
    id: number;
    name: string;
}

interface AttendanceCreate {
    auth: { user: any };
    subjects: { data: Subject[] };
    teachers?: Teacher[] | null;
    authUserId: number;
    userRole: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Attendances',
        href: '/attendances',
    },
    {
        title: 'Create',
        href: '/attendances/create',
    },
];

export default function Create({ auth, subjects, teachers, authUserId, userRole }: AttendanceCreate) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<number | ''>('');
    const [selectedTeacher, setSelectedTeacher] = useState<number>(authUserId);
    const isTeacher = userRole === 'teacher';
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const { data, setData, post, processing, errors } = useForm({
        subject_id: '',
        date: new Date().toISOString().split('T')[0], // Today's date as default
        marked_by: authUserId.toString(),
        attendances: [] as { student_id: number; is_present: boolean }[],
    });

    // Reset students when changing subject
    useEffect(() => {
        if (selectedSubject) {
            setStudents([]);
            setData('subject_id', selectedSubject.toString());
        }
    }, [selectedSubject]);

    // Update attendances array when students change
    useEffect(() => {
        const attendances = students.map((student) => ({
            student_id: student.id,
            is_present: student.attendance_status ?? false,
        }));
        setData('attendances', attendances);
    }, [students]);

    // Update marked_by when teacher selection changes
    useEffect(() => {
        if (selectedTeacher) {
            setData('marked_by', selectedTeacher.toString());
        }
    }, [selectedTeacher]);

    // Function to fetch students for a subject
    const fetchStudents = async () => {
        if (!data.subject_id || !data.date) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(route('subject.students'), {
                subject_id: data.subject_id,
                date: data.date,
            });

            console.log('API Response:', response.data); // Add this for debugging

            if (response.data && Array.isArray(response.data.students)) {
                setStudents(response.data.students);
            } else {
                console.error('Invalid response format:', response.data);
                setStudents([]);
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (students.length === 0) {
            console.error('No students to mark attendance for');
            return;
        }

        post(route('attendances.store'));
    };

    // Toggle attendance status for a student
    const toggleAttendance = (studentId: number) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) => (student.id === studentId ? { ...student, attendance_status: !student.attendance_status } : student)),
        );
    };

    // Handle date selection
    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            // Format date for form submission (YYYY-MM-DD)
            const formattedDate = date.toISOString().split('T')[0];
            setData('date', formattedDate);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Attendance" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="overflow-hidden shadow-sm sm:rounded-lg">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Attendance</CardTitle>
                            <CardDescription>Mark attendance for students in a subject.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* Subject Selection */}
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Select value={data.subject_id} onValueChange={(value) => setSelectedSubject(value ? parseInt(value) : '')}>
                                            <SelectTrigger id="subject">
                                                <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects.data.map((subject) => (
                                                    <SelectItem key={subject.id} value={subject.id.toString()}>
                                                        {subject.code} - {subject.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.subject_id} />
                                    </div>

                                    {/* Date Selection */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Date</Label>
                                        <DatePicker selected={selectedDate} onSelect={handleDateSelect} placeholder="Select date" />
                                        <InputError message={errors.date} />
                                    </div>

                                    {/* Teacher Selection (Admin Only) */}
                                    {!isTeacher && teachers && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="teacher">Marked By</Label>
                                            <Select value={selectedTeacher.toString()} onValueChange={(value) => setSelectedTeacher(parseInt(value))}>
                                                <SelectTrigger id="teacher">
                                                    <SelectValue placeholder="Select a teacher" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teachers.map((teacher) => (
                                                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                            {teacher.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.marked_by} />
                                        </div>
                                    )}
                                </div>

                                {/* Fetch Students Button */}
                                <div>
                                    <Button type="button" onClick={fetchStudents} disabled={!data.subject_id || !data.date || loading}>
                                        {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        {loading ? 'Loading...' : 'Fetch Students'}
                                    </Button>
                                </div>

                                {/* Student List with Checkboxes */}
                                {students.length > 0 && (
                                    <div>
                                        <h3 className="text-md mb-4 font-medium">Students</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                {students.map((student) => (
                                                    <div key={student.id} className="flex items-center gap-4">
                                                        <Checkbox
                                                            id={`student-${student.id}`}
                                                            name={`student-${student.id}`}
                                                            checked={student.attendance_status ?? false}
                                                            onCheckedChange={() => toggleAttendance(student.id)}
                                                        />
                                                        <Label htmlFor={`student-${student.id}`} className="cursor-pointer">
                                                            {student.registration_number} - {student.full_name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                {students.length > 0 && (
                                    <div className="flex items-center justify-end gap-4">
                                        <Button type="button" variant="outline" onClick={() => router.visit(route('attendances.index'))}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                            {processing ? 'Saving...' : 'Save Attendance'}
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
