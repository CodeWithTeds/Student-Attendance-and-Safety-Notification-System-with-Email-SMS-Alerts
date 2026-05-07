<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SectionResource;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SectionScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/schedules/index', [
            'sections' => SectionResource::collection(
                Section::query()
                    ->with(['gradeLevel', 'adviser', 'schedule'])
                    ->withCount('students')
                    ->when($request->string('search')->toString(), function ($query, string $search): void {
                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('school_year', 'like', "%{$search}%")
                            ->orWhereHas('gradeLevel', fn ($gradeLevelQuery) => $gradeLevelQuery->where('name', 'like', "%{$search}%"))
                            ->orWhereHas('adviser', fn ($adviserQuery) => $adviserQuery
                                ->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%"));
                    })
                    ->latest()
                    ->paginate(10)
                    ->withQueryString()
            ),
            'filters' => $request->only('search'),
        ]);
    }
}
