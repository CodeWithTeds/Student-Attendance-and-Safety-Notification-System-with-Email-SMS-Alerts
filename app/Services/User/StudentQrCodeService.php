<?php

namespace App\Services\User;

use App\Models\User;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Str;

class StudentQrCodeService
{
    public function generatePayload(User $student, ?string $studentId = null, ?string $studentNumber = null, ?string $token = null): string
    {
        return sprintf(
            'SASN-STUDENT|%s|%s|%s|%s',
            $studentId ?? $student->student_id,
            $studentNumber ?? $student->student_number,
            $student->email,
            $token ?? Str::uuid()
        );
    }

    public function generateSvg(string $payload, int $size = 180): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle($size),
            new SvgImageBackEnd
        );

        return (new Writer($renderer))->writeString($payload);
    }
}
