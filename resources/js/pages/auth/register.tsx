/**
 * Register Page — Student Registration
 *
 * Orchestrates the multi-step registration form.
 * All form logic, validation schemas, and step UI are separated
 * into their own files under features/auth/.
 */

import { Head, Link, useForm } from '@inertiajs/react';
import { User, MapPin, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

// Feature-specific imports (separation of concerns)
import AddressInfoStep from '@/features/auth/components/AddressInfoStep';
import BasicInfoStep from '@/features/auth/components/BasicInfoStep';
import CompletionStep from '@/features/auth/components/CompletionStep';
import RegistrationStepper from '@/features/auth/components/RegistrationStepper';
import {
    validateStep,
    hasErrors,
} from '@/features/auth/schemas/registerSchema';
import type {
    RegisterFormData,
    StepConfig,
    StepErrors,
} from '@/features/auth/types/registerTypes';
import { login } from '@/routes';
import { store } from '@/routes/register';

// ── Step configuration ──

const STEPS: StepConfig[] = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'Address Information', icon: MapPin },
    { id: 3, title: 'Completion', icon: ShieldCheck },
];

const TOTAL_STEPS = STEPS.length;

// ── Initial form state ──

const initialFormData: RegisterFormData = {
    student_id: '',
    student_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    grade_level_id: '',
    gender: 'Male',
    date_of_birth: '',
    place_of_birth: '',
    nationality: 'Filipino',
    house_no: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zip_code: '',
    email: '',
    password: '',
    password_confirmation: '',
};

// ── Page Component ──

export default function Register({ gradeLevels = [] }: { gradeLevels: Array<{ id: number; name: string; code: string }> }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [stepErrors, setStepErrors] = useState<StepErrors>({});

    const { data, setData, post, processing, errors, reset } =
        useForm<RegisterFormData>(initialFormData);

    // Generate student_id and student_number on mount
    useEffect(() => {
        setData((prev) => ({
            ...prev,
            student_id: crypto.randomUUID(),
            student_number: `2580${Math.floor(1000 + Math.random() * 9000)}`,
        }));
    }, [setData]);

    // Clear step errors when user edits a field
    const handleFieldChange = (
        field: keyof RegisterFormData,
        value: string,
    ) => {
        setData(field, value);

        // Remove the error for this field on change
        if (stepErrors[field]) {
            setStepErrors((prev) => {
                const next = { ...prev };
                delete next[field];

                return next;
            });
        }
    };

    // Validate current step before advancing
    const handleNext = () => {
        const errors = validateStep(currentStep, data);
        setStepErrors(errors);

        if (!hasErrors(errors)) {
            setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
        }
    };

    const handleBack = () => {
        setStepErrors({});
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // Final submit — validate step 3 first
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const errors = validateStep(currentStep, data);
        setStepErrors(errors);

        if (hasErrors(errors)) {
            return;
        }

        post(store.url(), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Student Registration" />

            <RegistrationStepper steps={STEPS} currentStep={currentStep} />

            <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                    <BasicInfoStep
                        data={data}
                        stepErrors={stepErrors}
                        gradeLevels={gradeLevels}
                        onChange={handleFieldChange}
                    />
                )}

                {currentStep === 2 && (
                    <AddressInfoStep
                        data={data}
                        stepErrors={stepErrors}
                        onChange={handleFieldChange}
                    />
                )}

                {currentStep === 3 && (
                    <CompletionStep
                        data={data}
                        stepErrors={stepErrors}
                        serverErrors={errors}
                        onChange={handleFieldChange}
                    />
                )}

                {/* Navigation buttons */}
                <div className="flex items-center gap-3 border-t pt-6">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            className="h-10 flex-1"
                        >
                            Back
                        </Button>
                    )}
                    {currentStep < TOTAL_STEPS ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            className="h-10 flex-1"
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-10 flex-1"
                        >
                            {processing && <Spinner className="mr-2" />}
                            Complete Registration
                        </Button>
                    )}
                </div>

                {/* Login link */}
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        href={login.url()}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            </form>
        </>
    );
}

Register.layout = {
    title: 'Student Registration',
    description: 'Fill in the form below to create your student account.',
};
