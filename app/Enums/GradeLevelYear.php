<?php

namespace App\Enums;

enum GradeLevelYear: string
{
    case FIRST_YEAR = 'First Year';
    case SECOND_YEAR = 'Second Year';
    case THIRD_YEAR = 'Third Year';
    case FOURTH_YEAR = 'Fourth Year';

    public function code(): string
    {
        return match ($this) {
            self::FIRST_YEAR => 'FY',
            self::SECOND_YEAR => 'SY',
            self::THIRD_YEAR => 'TY',
            self::FOURTH_YEAR => 'FOY',
        };
    }

    public function sortOrder(): int
    {
        return match ($this) {
            self::FIRST_YEAR => 1,
            self::SECOND_YEAR => 2,
            self::THIRD_YEAR => 3,
            self::FOURTH_YEAR => 4,
        };
    }

    public static function fromName(string $name): self
    {
        return self::from($name);
    }
}
