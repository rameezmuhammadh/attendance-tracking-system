<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\Subject;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\StudentResource;
use App\Http\Resources\SubjectResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Attendance::query()->with(['student', 'subject', 'markedBy'])->latest('date');

        // Default date range: one week before today to today midnight
        $endDate = $request->input('end_date', now()->format('Y-m-d'));
        $startDate = $request->input('start_date', now()->subDays(7)->format('Y-m-d'));

        // Filter by date range
        $query->whereBetween('date', [$startDate, $endDate]);

        // Search by student name or registration number
        if ($search = $request->input('search')) {
            $terms = explode(' ', $search);

            $query->whereHas('student', function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->where('first_name', 'like', '%' . $term . '%')
                            ->orWhere('last_name', 'like', '%' . $term . '%')
                            ->orWhere('registration_number', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        // Filter by subject
        if ($subjectId = $request->input('subject_id')) {
            $query->where('subject_id', $subjectId);
        }

        // Filter by attendance status (present/absent)
        if ($request->has('is_present')) {
            $query->where('is_present', $request->boolean('is_present'));
        }

        // Filter by department (via student relationship)
        if ($departmentId = $request->input('department_id')) {
            $query->whereHas('student', function ($q) use ($departmentId) {
                $q->where('department_id', $departmentId);
            });
        }

        // Get pagination parameters
        $perPage = $request->input('per_page', 15);
        $currentPage = $request->input('page', 1);

        $attendances = $query->paginate($perPage)
            ->withQueryString();

        // Get departments and subjects for filters
        $departments = Department::all();
        $subjects = Subject::all();

        return Inertia::render('attendances/index', [
            'attendances' => AttendanceResource::collection($attendances),
            'departments' => DepartmentResource::collection($departments),
            'subjects' => SubjectResource::collection($subjects),
            'params' => array_merge($request->all(), [
                'page' => $currentPage,
                'per_page' => $perPage,
                'start_date' => $startDate,
                'end_date' => $endDate
            ]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();
        $isTeacher = $user->role === 'teacher';

        // Get subjects based on user role
        if ($isTeacher) {
            // For teachers, only show their assigned subjects
            $subjects = $user->subjects;
            $teachers = collect([$user]); // Only the current teacher
        } else {
            // For admins, show all subjects
            $subjects = Subject::all();
            $teachers = \App\Models\User::where('role', 'teacher')->get();
        }

        return Inertia::render('attendances/create', [
            'subjects' => SubjectResource::collection($subjects),
            'teachers' => $isTeacher ? null : $teachers->map(fn($teacher) => [
                'id' => $teacher->id,
                'name' => $teacher->name,
            ]),
            'authUserId' => $user->id,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'marked_by' => 'required|exists:users,id',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.is_present' => 'required|boolean',
        ]);

        $user = auth()->user();

        // Check if user is a teacher and the subject belongs to them
        if ($user->role === 'teacher') {
            $subjectBelongsToTeacher = $user->subjects->contains($validated['subject_id']);

            if (!$subjectBelongsToTeacher) {
                return response()->json([
                    'message' => 'You are not authorized to mark attendance for this subject.'
                ], 403);
            }

            // Ensure the marked_by is the authenticated teacher
            if ($validated['marked_by'] != $user->id) {
                return response()->json([
                    'message' => 'As a teacher, you can only mark attendance as yourself.'
                ], 403);
            }
        }

        $attendances = [];
        $date = $validated['date'];
        $subjectId = $validated['subject_id'];
        $markedBy = $validated['marked_by'];

        // Process each attendance record
        foreach ($validated['attendances'] as $attendance) {
            $studentId = $attendance['student_id'];
            $isPresent = $attendance['is_present'];

            // Create or update attendance record
            Attendance::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'subject_id' => $subjectId,
                    'date' => $date,
                ],
                [
                    'is_present' => $isPresent,
                    'marked_by' => $markedBy,
                ]
            );
        }

        return redirect()->route('attendances.index')
            ->with('message', 'Attendance recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance $attendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        //
    }

    /**
     * Get students enrolled in a subject.
     */
    public function getStudentsBySubject(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
        ]);

        $subject = Subject::findOrFail($validated['subject_id']);

        // Get students enrolled in this subject
        $students = $subject->students()
            ->with('department')
            ->orderBy('registration_number')
            ->get();

        // Check if there are already attendance records for these students on the given date
        $existingAttendances = Attendance::where('subject_id', $validated['subject_id'])
            ->where('date', $validated['date'])
            ->pluck('is_present', 'student_id')
            ->toArray();

        // Create a simplified student array directly without using StudentResource
        $studentsData = $students->map(function ($student) use ($existingAttendances) {
            return [
                'id' => $student->id,
                'registration_number' => $student->registration_number,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'full_name' => $student->full_name,
                'attendance_status' => $existingAttendances[$student->id] ?? null,
            ];
        })->toArray();

        return response()->json([
            'students' => $studentsData,
        ]);
    }
}
