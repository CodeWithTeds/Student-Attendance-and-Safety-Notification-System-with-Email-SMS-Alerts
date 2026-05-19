<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\Student\StudentProfileService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        protected StudentProfileService $studentProfileService
    ) {}

    public function show(Request $request): Response
    {
        return Inertia::render('student/profile', [
            'student' => (new UserResource($this->studentProfileService->getProfile($request->user())))->resolve($request),
        ]);
    }
}
