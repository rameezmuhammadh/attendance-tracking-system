<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentGroupRequest;
use App\Http\Requests\UpdateStudentGroupRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\StudentGroupResource;
use App\Models\Department;
use App\Models\StudentGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StudentGroup::query()->with('department')->latest();

        // Search by group name
        if ($search = $request->input('search')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->where('name', 'like', '%' . $term . '%')
                            ->orWhere('description', 'like', '%' . $term . '%')
                            ->orWhere('year_level', 'like', '%' . $term . '%')
                            ->orWhere('section', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        // Filter by department
        if ($departmentId = $request->input('department_id')) {
            $query->where('department_id', $departmentId);
        }

        // Get pagination parameters
        $perPage = $request->input('per_page', 10);
        $currentPage = $request->input('page', 1);

        $studentGroups = $query->paginate($perPage)
            ->withQueryString();

        $departments = Department::all();

        return Inertia::render('student-groups/index', [
            'studentGroups' => StudentGroupResource::collection($studentGroups),
            // 'departments' => DepartmentResource::collection($departments),
            'departments' => $departments,
            'params' => array_merge($request->all(), ['page' => $currentPage, 'per_page' => $perPage]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();

        return Inertia::render('student-groups/create', [
            'departments' => DepartmentResource::collection($departments),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentGroupRequest $request)
    {
        $validatedData = $request->validated();

        // Create the student group
        StudentGroup::create($validatedData);

        return redirect()->route('student-groups.index')->with('success', 'Student group created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentGroup $studentGroup)
    {
        return Inertia::render('student-groups/show', [
            'studentGroup' => new StudentGroupResource($studentGroup->load('department', 'students')),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentGroup $studentGroup)
    {
        $departments = Department::all();

        return Inertia::render('student-groups/edit', [
            'studentGroup' => new StudentGroupResource($studentGroup),
            'departments' => DepartmentResource::collection($departments),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentGroupRequest $request, StudentGroup $studentGroup)
    {
        $validatedData = $request->validated();

        // Update the student group
        $studentGroup->update($validatedData);

        return redirect()->route('student-groups.index')->with('success', 'Student group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentGroup $studentGroup)
    {
        $studentGroup->delete();

        return redirect()->back()->with('success', 'Student group deleted successfully.');
    }
}
