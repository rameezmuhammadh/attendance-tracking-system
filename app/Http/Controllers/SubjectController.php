<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\StudentResource;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Subject::query()->latest();

        // Search by subject name or code
        if ($search = $request->input('search')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->where('name', 'like', '%' . $term . '%')
                            ->orWhere('code', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        // Get pagination parameters
        $perPage = $request->input('per_page', 10);
        $currentPage = $request->input('page', 1);

        $subjects = $query->paginate($perPage)
            ->withQueryString();

        return Inertia::render('subjects/index', [
            'subjects' => SubjectResource::collection($subjects),
            'params' => array_merge($request->all(), ['page' => $currentPage, 'per_page' => $perPage]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('subjects/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubjectRequest $request)
    {
        $validatedData = $request->validated();

        // Create the subject
        Subject::create($validatedData);

        return redirect()->route('subjects.index')->with('success', 'Subject created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Subject $subject)
    {
        // Load related teachers and students with their departments
        $subject->load(['teachers.department', 'students.department', 'students.studentGroup']);

        return Inertia::render('subjects/show', [
            'subject' => (new SubjectResource($subject->loadMissing([
                'teachers.department',
                'students.department',
                'students.studentGroup'
            ]))),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subject $subject)
    {
        return Inertia::render('subjects/edit', [
            'subject' => new SubjectResource($subject),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubjectRequest $request, Subject $subject)
    {
        $validatedData = $request->validated();

        // Update the subject
        $subject->update($validatedData);

        return redirect()->route('subjects.index')->with('success', 'Subject updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();

        return redirect()->back()->with('success', 'Subject deleted successfully.');
    }
}
