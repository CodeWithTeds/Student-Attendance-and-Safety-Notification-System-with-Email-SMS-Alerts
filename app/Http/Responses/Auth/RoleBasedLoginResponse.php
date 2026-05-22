<?php

namespace App\Http\Responses\Auth;

use App\Enums\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RoleBasedLoginResponse implements LoginResponseContract
{
    public function toResponse($request): Response
    {
        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false])
            : redirect()->intended($this->redirectPath($request));
    }

    private function redirectPath(Request $request): string
    {
        return match ($request->user()?->role) {
            UserRole::PARENT => route('parent.dashboard', absolute: false),
            default => route('dashboard', absolute: false),
        };
    }
}
