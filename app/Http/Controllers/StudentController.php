<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\StudentResource;
use App\Http\Resources\StudentGroupResource;
use App\Models\Department;
use App\Models\StudentGroup;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Student::query()->with(['department', 'studentGroups'])->latest();

        // Search by student name, email, or registration number
        if ($search = $request->input('search')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->where('first_name', 'like', '%' . $term . '%')
                            ->orWhere('last_name', 'like', '%' . $term . '%')
                            ->orWhere('email', 'like', '%' . $term . '%')
                            ->orWhere('registration_number', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        // Filter by first year status
        if ($request->has('is_first_year')) {
            $query->where('is_first_year', $request->boolean('is_first_year'));
        }

        // Filter by department
        if ($departmentId = $request->input('department_id')) {
            $query->where('department_id', $departmentId);
        }

        // Filter by student group
        if ($studentGroupId = $request->input('student_group_id')) {
            $query->where('student_group_id', $studentGroupId);
        }

        // Get pagination parameters
        $perPage = $request->input('per_page', 10);
        $currentPage = $request->input('page', 1);

        $students = $query->paginate($perPage)
            ->withQueryString();

        $departments = Department::all();
        $studentGroups = StudentGroup::all();

        return Inertia::render('students/index', [
            'students' => StudentResource::collection($students),
            'departments' => DepartmentResource::collection($departments),
            'studentGroups' => StudentGroupResource::collection($studentGroups),
            'params' => array_merge($request->all(), ['page' => $currentPage, 'per_page' => $perPage]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();
        $studentGroups = StudentGroup::all();

        return Inertia::render('students/create', [
            'departments' => DepartmentResource::collection($departments),
            'studentGroups' => StudentGroupResource::collection($studentGroups),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request)
    {
        $validatedData = $request->validated();

        // Create the student
        Student::create($validatedData);

        return redirect()->route('students.index')->with('success', 'Student created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        $student->load(['department', 'studentGroups', 'subjects', 'attendances']);

        return Inertia::render('students/show', [
            'student' => new StudentResource($student),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        $departments = Department::all();
        $studentGroups = StudentGroup::all();

        return Inertia::render('students/edit', [
            'student' => new StudentResource($student),
            'departments' => DepartmentResource::collection($departments),
            'studentGroups' => StudentGroupResource::collection($studentGroups),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
        $validatedData = $request->validated();

        // Update the student
        $student->update($validatedData);

        return redirect()->route('students.index')->with('success', 'Student updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->back()->with('success', 'Student deleted successfully.');
    }
}
