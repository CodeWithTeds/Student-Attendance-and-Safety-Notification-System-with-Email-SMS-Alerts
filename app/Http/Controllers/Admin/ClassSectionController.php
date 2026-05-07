<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\ClassSection\AssignSectionStudentsRequest;
use App\Http\Requests\ClassSection\StoreAdviserRequest;
use App\Http\Requests\ClassSection\StoreGradeLevelRequest;
use App\Http\Requests\ClassSection\StoreSectionRequest;
use App\Http\Requests\ClassSection\UpdateAdviserRequest;
use App\Http\Requests\ClassSection\UpdateGradeLevelRequest;
use App\Http\Requests\ClassSection\UpdateSectionRequest;
use App\Http\Requests\ClassSection\UpdateSectionScheduleRequest;
use App\Http\Resources\AdviserResource;
use App\Http\Resources\GradeLevelResource;
use App\Http\Resources\SectionResource;
use App\Http\Resources\UserResource;
use App\Models\Adviser;
use App\Models\GradeLevel;
use App\Models\Section;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ClassSectionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/class-sections/index', [
            'sections' => SectionResource::collection($this->sectionQuery()->paginate(10)),
            'gradeLevels' => GradeLevelResource::collection($this->gradeLevelQuery()->get()),
            'advisers' => AdviserResource::collection($this->adviserQuery()->get()),
            'students' => UserResource::collection($this->studentQuery()->get()),
        ]);
    }

    public function storeGradeLevel(StoreGradeLevelRequest $request): RedirectResponse
    {
        GradeLevel::create($request->validated());

        return redirect()->route('admin.class-sections.index')->with('success', 'Grade level created successfully.');
    }

    public function updateGradeLevel(UpdateGradeLevelRequest $request, GradeLevel $gradeLevel): RedirectResponse
    {
        $gradeLevel->update($request->validated());

        return redirect()->route('admin.class-sections.index')->with('success', 'Grade level updated successfully.');
    }

    public function destroyGradeLevel(GradeLevel $gradeLevel): RedirectResponse
    {
        $gradeLevel->delete();

        return redirect()->route('admin.class-sections.index')->with('success', 'Grade level deleted successfully.');
    }

    public function storeAdviser(StoreAdviserRequest $request): RedirectResponse
    {
        Adviser::create($request->validated());

        return redirect()->route('admin.class-sections.index')->with('success', 'Adviser created successfully.');
    }

    public function updateAdviser(UpdateAdviserRequest $request, Adviser $adviser): RedirectResponse
    {
        $adviser->update($request->validated());

        return redirect()->route('admin.class-sections.index')->with('success', 'Adviser updated successfully.');
    }

    public function destroyAdviser(Adviser $adviser): RedirectResponse
    {
        $adviser->delete();

        return redirect()->route('admin.class-sections.index')->with('success', 'Adviser deleted successfully.');
    }

    public function storeSection(StoreSectionRequest $request): RedirectResponse
    {
        Section::create($request->validated());

        return redirect()->route('admin.class-sections.index')->with('success', 'Section created successfully.');
    }

    public function updateSection(UpdateSectionRequest $request, Section $section): RedirectResponse
    {
        $section->update($request->validated());

        return redirect()->route('admin.class-sections.index')->with('success', 'Section updated successfully.');
    }

    public function destroySection(Section $section): RedirectResponse
    {
        $section->delete();

        return redirect()->route('admin.class-sections.index')->with('success', 'Section deleted successfully.');
    }

    public function assignStudents(AssignSectionStudentsRequest $request, Section $section): RedirectResponse
    {
        $studentIds = $request->validated()['student_ids'];
        $currentCount = $section->students()->whereNotIn('users.id', $studentIds)->count();

        if ($section->capacity && $currentCount + count($studentIds) > $section->capacity) {
            return redirect()->route('admin.class-sections.index')->with('error', 'Selected students exceed the section capacity.');
        }

        DB::transaction(function () use ($section, $studentIds) {
            DB::table('section_student')->whereIn('student_id', $studentIds)->delete();
            $section->students()->attach($studentIds);
        });

        return redirect()->route('admin.class-sections.index')->with('success', 'Students assigned successfully.');
    }

    public function unassignStudent(Section $section, User $student): RedirectResponse
    {
        $section->students()->detach($student->id);

        return redirect()->route('admin.class-sections.index')->with('success', 'Student removed from section successfully.');
    }

    public function updateSectionSchedule(UpdateSectionScheduleRequest $request, Section $section): RedirectResponse
    {
        $section->schedule()->updateOrCreate(['section_id' => $section->id], $request->scheduleData());

        return redirect()->route('admin.class-sections.index')->with('success', 'Section schedule saved successfully.');
    }

    public function destroySectionSchedule(Section $section): RedirectResponse
    {
        $section->schedule()->delete();

        return redirect()->route('admin.class-sections.index')->with('success', 'Section schedule removed successfully.');
    }

    private function sectionQuery()
    {
        return Section::query()
            ->with(['gradeLevel', 'adviser', 'schedule', 'students' => fn ($query) => $query->select('users.id', 'users.name', 'users.email', 'users.student_number', 'users.role', 'users.status', 'users.created_at', 'users.updated_at')])
            ->withCount('students')
            ->latest();
    }

    private function gradeLevelQuery()
    {
        return GradeLevel::query()
            ->withCount('sections')
            ->orderBy('sort_order')
            ->orderBy('name');
    }

    private function adviserQuery()
    {
        return Adviser::query()
            ->withCount('sections')
            ->orderBy('last_name')
            ->orderBy('first_name');
    }

    private function studentQuery()
    {
        return User::query()
            ->select('id', 'name', 'email', 'student_number', 'role', 'status', 'first_name', 'middle_name', 'last_name', 'created_at', 'updated_at')
            ->with(['sections' => fn ($query) => $query->with(['gradeLevel', 'schedule'])->select('sections.id', 'sections.grade_level_id', 'sections.name', 'sections.school_year')])
            ->where('role', UserRole::STUDENT->value)
            ->orderBy('name');
    }
}
