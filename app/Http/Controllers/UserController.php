<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\SubjectResource;
use App\Http\Resources\UserResource;
use App\Models\Department;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query()->with('department')->latest();

        // Search by user name or email
        if ($search = $request->input('search')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->where('name', 'like', '%' . $term . '%')
                            ->orWhere('email', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        // Filter by role
        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        // Filter by department
        if ($departmentId = $request->input('department_id')) {
            $query->where('department_id', $departmentId);
        }

        // Get pagination parameters
        $perPage = $request->input('per_page', 10);
        $currentPage = $request->input('page', 1);

        $users = $query->paginate($perPage)
            ->withQueryString();

        $departments = Department::all();

        return Inertia::render('users/index', [
            'users' => UserResource::collection($users),
            'departments' => DepartmentResource::collection($departments),
            'params' => array_merge($request->all(), ['page' => $currentPage, 'per_page' => $perPage]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();
        $subjects = Subject::all();

        return Inertia::render('users/create', [
            'departments' => DepartmentResource::collection($departments),
            'subjects' => SubjectResource::collection($subjects),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validatedData = $request->validated();

        // Hash the password
        $validatedData['password'] = Hash::make($validatedData['password']);

        // Create the user
        $user = User::create($validatedData);

        // If user is a teacher and subjects are selected, attach them
        if ($user->role === 'teacher' && isset($validatedData['subject_ids']) && is_array($validatedData['subject_ids'])) {
            // Limit to maximum 3 subjects per teacher
            $subjectIds = array_slice($validatedData['subject_ids'], 0, 3);
            $user->subjects()->attach($subjectIds);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $departments = Department::all();
        $subjects = Subject::all();

        return Inertia::render('users/edit', [
            'user' => new UserResource($user->load('subjects')),
            'departments' => DepartmentResource::collection($departments),
            'subjects' => SubjectResource::collection($subjects),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validatedData = $request->validated();

        // Only hash the password if it's provided
        if (isset($validatedData['password']) && $validatedData['password']) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        } else {
            unset($validatedData['password']);
        }

        // Update the user
        $user->update($validatedData);

        // Handle subject assignments for teachers
        if ($user->role === 'teacher' && isset($validatedData['subject_ids'])) {
            // Limit to maximum 3 subjects per teacher
            $subjectIds = array_slice($validatedData['subject_ids'], 0, 3);
            $user->subjects()->sync($subjectIds);
        } elseif ($user->role !== 'teacher') {
            // Remove all subjects if the user is not a teacher
            $user->subjects()->detach();
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
