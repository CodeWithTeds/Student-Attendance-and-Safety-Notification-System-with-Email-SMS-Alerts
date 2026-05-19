<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\SectionResource;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QrScannerController extends Controller
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function index(Request $request): Response
    {
        $student = $this->userRepository->getStudentWithSchedule((int) $request->user()->id);

        return Inertia::render('student/qr-scanner', [
            'studentSection' => $student?->sections->first() ? (new SectionResource($student->sections->first()))->resolve($request) : null,
        ]);
    }
}
