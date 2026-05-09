<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreStudentRequest;
use App\Http\Requests\User\UpdateStudentRequest;
use App\Http\Requests\User\BulkAssignSectionRequest;
use App\Http\Resources\SectionResource;
use App\Http\Resources\UserResource;
use App\Models\Section;
use App\Models\User;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use App\Services\User\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller

{
    public function __construct(
        protected UserService $userService,
        protected UserRepositoryInterface $userRepository
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/students/index', [
            'users' => UserResource::collection($this->userRepository->getStudentsPaginated()),
            'sections' => SectionResource::collection(Section::with('gradeLevel')->get()),
        ]);
    }

    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $this->userService->createUser($request->studentData());
        return redirect()->route('admin.students.index')->with('success', 'Student created successfully.');
    }

    public function update(UpdateStudentRequest $request, int $id): RedirectResponse
    {
        $this->userService->updateStudent($id, $request->studentData());
        return redirect()->route('admin.students.index')->with('success', 'Student updated successfully.');
    }

    public function approve(int $id): RedirectResponse
    {
        $this->userService->approveStudent($id);
        return redirect()->route('admin.students.index')->with('success', 'Student approved successfully.');
    }

    public function bulkAssignSection(BulkAssignSectionRequest $request): RedirectResponse
    {
        $studentIds = $request->validated()['student_ids'];
        $students = User::whereIn('id', $studentIds)->get();
        $assignedCount = 0;
        $unassignedStudents = [];

        DB::transaction(function () use ($students, &$assignedCount, &$unassignedStudents) {
            foreach ($students as $student) {
                if (!$student->grade_level_id) {
                    $unassignedStudents[] = $student->name;
                    continue;
                }

                // Find the first section for this grade level
                $section = Section::where('grade_level_id', $student->grade_level_id)->first();
                
                if ($section) {
                    // Remove existing assignments for this student
                    DB::table('section_student')->where('student_id', $student->id)->delete();
                    
                    // Attach to the new section
                    $section->students()->attach($student->id);
                    $assignedCount++;
                } else {
                    $unassignedStudents[] = $student->name . " (No section found for Grade Level)";
                }
            }
        });

        if (count($unassignedStudents) > 0) {
            $msg = "Assigned {$assignedCount} students. Errors: " . implode(', ', $unassignedStudents);
            return redirect()->back()->with('warning', $msg);
        }

        return redirect()->route('admin.students.index')->with('success', "Successfully assigned {$assignedCount} students to their respective grade level sections.");
    }
}
