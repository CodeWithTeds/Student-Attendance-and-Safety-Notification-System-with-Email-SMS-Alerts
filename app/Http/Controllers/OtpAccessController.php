<?php

namespace App\Http\Controllers;

use App\Enums\AttendanceEventType;
use App\Enums\UserRole;
use App\Mail\OtpMail;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OtpAccessController extends Controller
{
    /**
     * Show the OTP login page.
     */
    public function show(): Response
    {
        return Inertia::render('public/attendance-access');
    }

    /**
     * Send an OTP to the given email if it belongs to a student or parent.
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)
            ->whereIn('role', [UserRole::STUDENT->value, UserRole::PARENT->value])
            ->first();

        if (! $user) {
            return response()->json([
                'message' => 'No student or parent/guardian account found with this email address.',
            ], 422);
        }

        // Invalidate any existing unused OTPs for this email
        OtpCode::where('email', $request->email)
            ->where('used', false)
            ->update(['used' => true]);

        // Generate a 6-digit code
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        OtpCode::create([
            'email' => $request->email,
            'code' => $code,
            'expires_at' => now()->addMinutes(10),
        ]);

        // Determine student name for email
        $studentName = $user->first_name
            ? trim($user->first_name . ' ' . $user->last_name)
            : $user->name;

        Mail::to($request->email)->send(new OtpMail($code, $studentName));

        return response()->json([
            'message' => 'A verification code has been sent to your email.',
        ]);
    }

    /**
     * Verify the OTP and log the user in, then redirect to their dashboard.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $otp = OtpCode::where('email', $request->email)
            ->where('code', $request->code)
            ->where('used', false)
            ->latest()
            ->first();

        if (! $otp || ! $otp->isValid()) {
            return response()->json([
                'message' => 'Invalid or expired verification code.',
            ], 422);
        }

        // Mark OTP as used
        $otp->update(['used' => true]);

        $user = User::where('email', $request->email)
            ->whereIn('role', [UserRole::STUDENT->value, UserRole::PARENT->value])
            ->first();

        if (! $user) {
            return response()->json([
                'message' => 'Account not found.',
            ], 422);
        }

        // Log the user in (create session)
        Auth::login($user);
        $request->session()->regenerate();

        // Mark email as verified since they proved ownership via OTP
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        // Return redirect URL based on role
        $redirect = match ($user->role) {
            UserRole::PARENT => '/parent/dashboard',
            default => '/dashboard',
        };

        return response()->json([
            'verified' => true,
            'redirect' => $redirect,
        ]);
    }
}
