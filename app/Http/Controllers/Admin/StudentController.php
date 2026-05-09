<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreStudentRequest;
use App\Http\Requests\User\UpdateStudentRequest;
use App\Http\Resources\UserResource;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use App\Services\User\UserService;
use Illuminate\Http\RedirectResponse;
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
}
