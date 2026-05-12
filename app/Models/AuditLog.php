<?php

namespace App\Models;

use App\Enums\AuditLogCategory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Fillable(['actor_id', 'category', 'action', 'auditable_type', 'auditable_id', 'description', 'metadata', 'ip_address', 'user_agent'])]
class AuditLog extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'category' => AuditLogCategory::class,
            'metadata' => 'array',
        ];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }
}
