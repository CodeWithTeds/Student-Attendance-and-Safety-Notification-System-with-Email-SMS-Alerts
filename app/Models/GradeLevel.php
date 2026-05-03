<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'code', 'sort_order'])]
class GradeLevel extends Model
{
    use HasFactory;

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }
}
