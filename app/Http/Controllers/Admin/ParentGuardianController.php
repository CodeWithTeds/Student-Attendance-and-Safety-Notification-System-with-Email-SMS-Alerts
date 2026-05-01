<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guardian\StoreGuardianRequest;
use App\Http\Requests\Guardian\UpdateGuardianRequest;
use App\Http\Resources\UserResource;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use App\Services\User\UserService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ParentGuardianController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected UserRepositoryInterface $userRepository
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/parents/index', [
            'guardians' => UserResource::collection($this->userRepository->getParentsPaginated()),
            'students' => UserResource::collection($this->userRepository->getStudents()),
        ]);
    }

    public function store(StoreGuardianRequest $request): RedirectResponse
    {
        $this->userService->createUser($request->guardianData());
        return redirect()->route('admin.parents.index')->with('success', 'Guardian created successfully.');
    }

    public function update(UpdateGuardianRequest $request, int $guardian): RedirectResponse
    {
        $this->userService->updateUser($guardian, $request->guardianData());
        return redirect()->route('admin.parents.index')->with('success', 'Guardian updated successfully.');
    }

    public function destroy(int $guardian): RedirectResponse
    {
        $this->userRepository->delete($guardian);
        return redirect()->route('admin.parents.index')->with('success', 'Guardian deleted successfully.');
    }
}
