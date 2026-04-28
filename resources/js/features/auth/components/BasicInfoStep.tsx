/**
 * BasicInfoStep — Step 1 of student registration.
 * Handles personal information fields.
 */

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { RegisterFormData, StepErrors } from '../types/registerTypes';

interface BasicInfoStepProps {
    data: RegisterFormData;
    stepErrors: StepErrors;
    onChange: <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => void;
}

export default function BasicInfoStep({ data, stepErrors, onChange }: BasicInfoStepProps) {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Auto-generated IDs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="student_id" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Student ID
                    </Label>
                    <Input
                        id="student_id"
                        value={data.student_id}
                        disabled
                        className="h-10 bg-muted/60 font-mono text-xs text-muted-foreground"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="student_number" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Student Number
                    </Label>
                    <Input
                        id="student_number"
                        value={data.student_number}
                        disabled
                        className="h-10 bg-muted/60 font-mono text-xs text-muted-foreground"
                    />
                </div>
            </div>

            <div className="border-t pt-5" />

            {/* Name fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name <span className="text-destructive">*</span></Label>
                    <Input
                        id="first_name"
                        className={`h-10 ${stepErrors.first_name ? 'border-destructive' : ''}`}
                        value={data.first_name}
                        onChange={(e) => onChange('first_name', e.target.value)}
                        placeholder="Juan"
                    />
                    <InputError message={stepErrors.first_name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="middle_name">Middle Name <span className="text-xs text-muted-foreground">(optional)</span></Label>
                    <Input
                        id="middle_name"
                        className="h-10"
                        value={data.middle_name}
                        onChange={(e) => onChange('middle_name', e.target.value)}
                        placeholder="Santos"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name <span className="text-destructive">*</span></Label>
                    <Input
                        id="last_name"
                        className={`h-10 ${stepErrors.last_name ? 'border-destructive' : ''}`}
                        value={data.last_name}
                        onChange={(e) => onChange('last_name', e.target.value)}
                        placeholder="Dela Cruz"
                    />
                    <InputError message={stepErrors.last_name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="suffix">Suffix <span className="text-xs text-muted-foreground">(optional)</span></Label>
                    <Input
                        id="suffix"
                        className="h-10"
                        value={data.suffix}
                        onChange={(e) => onChange('suffix', e.target.value)}
                        placeholder="Jr., Sr., III"
                    />
                </div>
            </div>

            {/* Details row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender <span className="text-destructive">*</span></Label>
                    <Select value={data.gender} onValueChange={(val) => onChange('gender', val)}>
                        <SelectTrigger className={`h-10 ${stepErrors.gender ? 'border-destructive' : ''}`}>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={stepErrors.gender} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth <span className="text-destructive">*</span></Label>
                    <Input
                        id="date_of_birth"
                        type="date"
                        className={`h-10 ${stepErrors.date_of_birth ? 'border-destructive' : ''}`}
                        value={data.date_of_birth}
                        onChange={(e) => onChange('date_of_birth', e.target.value)}
                    />
                    <InputError message={stepErrors.date_of_birth} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="place_of_birth">Place of Birth <span className="text-xs text-muted-foreground">(optional)</span></Label>
                    <Input
                        id="place_of_birth"
                        className="h-10"
                        value={data.place_of_birth}
                        onChange={(e) => onChange('place_of_birth', e.target.value)}
                        placeholder="Manila, Philippines"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality <span className="text-destructive">*</span></Label>
                    <Input
                        id="nationality"
                        className={`h-10 ${stepErrors.nationality ? 'border-destructive' : ''}`}
                        value={data.nationality}
                        onChange={(e) => onChange('nationality', e.target.value)}
                    />
                    <InputError message={stepErrors.nationality} />
                </div>
            </div>
        </div>
    );
}
