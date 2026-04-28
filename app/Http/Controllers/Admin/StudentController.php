<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\User\UserService;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use App\Http\Resources\UserResource;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

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

    public function approve(int $id): RedirectResponse
    {
        $this->userService->updateStatus($id, 'approved');
        return redirect()->route('admin.students.index')->with('success', 'Student approved successfully.');
    }
}
