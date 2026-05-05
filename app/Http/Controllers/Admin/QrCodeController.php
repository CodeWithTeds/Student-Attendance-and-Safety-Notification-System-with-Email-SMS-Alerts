<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\User\StudentQrManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QrCodeController extends Controller
{
    public function __construct(
        protected StudentQrManagementService $studentQrManagementService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/qr-codes/index', [
            'students' => UserResource::collection(
                $this->studentQrManagementService->getPaginatedStudents($request->only(['search', 'qr_status']))
            ),
            'filters' => $request->only(['search', 'qr_status']),
        ]);
    }

    public function generate(int $student): RedirectResponse
    {
        $this->studentQrManagementService->generateQrCode($student);

        return redirect()->route('admin.qr-codes.index')->with('success', 'Student QR code generated successfully.');
    }

    public function reset(int $student): RedirectResponse
    {
        $this->studentQrManagementService->resetQrCode($student);

        return redirect()->route('admin.qr-codes.index')->with('success', 'Student QR code reset successfully.');
    }
}
