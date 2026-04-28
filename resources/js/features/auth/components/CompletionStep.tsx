/**
 * CompletionStep — Step 3 of student registration.
 * Handles email & password (account creation) fields.
 */

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RegisterFormData, StepErrors } from '../types/registerTypes';

interface CompletionStepProps {
    data: RegisterFormData;
    stepErrors: StepErrors;
    serverErrors: Partial<Record<keyof RegisterFormData, string>>;
    onChange: <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => void;
}

export default function CompletionStep({ data, stepErrors, serverErrors, onChange }: CompletionStepProps) {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input
                    id="email"
                    type="email"
                    className={`h-10 ${stepErrors.email || serverErrors.email ? 'border-destructive' : ''}`}
                    value={data.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    placeholder="you@example.com"
                />
                <InputError message={stepErrors.email || serverErrors.email} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <PasswordInput
                    id="password"
                    className={`h-10 ${stepErrors.password || serverErrors.password ? 'border-destructive' : ''}`}
                    value={data.password}
                    onChange={(e) => onChange('password', e.target.value)}
                    placeholder="Create a strong password"
                />
                <InputError message={stepErrors.password || serverErrors.password} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password <span className="text-destructive">*</span></Label>
                <PasswordInput
                    id="password_confirmation"
                    className={`h-10 ${stepErrors.password_confirmation ? 'border-destructive' : ''}`}
                    value={data.password_confirmation}
                    onChange={(e) => onChange('password_confirmation', e.target.value)}
                    placeholder="Confirm your password"
                />
                <InputError message={stepErrors.password_confirmation} />
            </div>
        </div>
    );
}
