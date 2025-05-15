<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\Subject;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\DepartmentResource;
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
}
