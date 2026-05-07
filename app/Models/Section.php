<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['grade_level_id', 'adviser_id', 'name', 'school_year', 'capacity'])]
class Section extends Model
{
    use HasFactory;

    public function gradeLevel(): BelongsTo
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function adviser(): BelongsTo
    {
        return $this->belongsTo(Adviser::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'section_student', 'section_id', 'student_id')
            ->withTimestamps();
    }

    public function schedule(): HasOne
    {
        return $this->hasOne(SectionSchedule::class);
    }
}
