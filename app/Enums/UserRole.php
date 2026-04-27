<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case PARENT = 'parent';
    case STUDENT = 'student';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::PARENT => 'Parent',
            self::STUDENT => 'Student',
        };
    }
}
