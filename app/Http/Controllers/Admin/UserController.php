<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\User\UserService;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected UserRepositoryInterface $userRepository
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($this->userRepository->getPaginated()),
            'students' => UserResource::collection($this->userRepository->getStudents()),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->userService->createUser($request->validated());
        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function update(UpdateUserRequest $request, int $id): RedirectResponse
    {
        $this->userService->updateUser($id, $request->validated());
        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->userService->deleteUser($id);
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
