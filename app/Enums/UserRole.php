<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case OFFICE = 'office';
    case PARENT = 'parent';
    case STUDENT = 'student';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::OFFICE => 'Office',
            self::PARENT => 'Parent',
            self::STUDENT => 'Student',
        };
    }
}
