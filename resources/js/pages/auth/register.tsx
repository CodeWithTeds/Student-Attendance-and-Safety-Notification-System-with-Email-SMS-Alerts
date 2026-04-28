import { FormEvent, useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/register';
import { login } from '@/routes';
import { Check, User, MapPin, ShieldCheck } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const steps = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'Address Information', icon: MapPin },
    { id: 3, title: 'Completion', icon: ShieldCheck },
];

export default function Register() {
    const [currentStep, setCurrentStep] = useState(1);
    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        student_number: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
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
    });

    useEffect(() => {
        setData((data) => ({
            ...data,
            student_id: crypto.randomUUID(),
            student_number: `2580${Math.floor(1000 + Math.random() * 9000)}`,
        }));
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(store.url(), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    const validateStep = (step: number) => {
        if (step === 1) {
            return (
                data.first_name &&
                data.last_name &&
                data.gender &&
                data.date_of_birth &&
                data.nationality
            );
        }
        if (step === 2) {
            return (
                data.street &&
                data.barangay &&
                data.city &&
                data.province &&
                data.zip_code
            );
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    return (
        <>
            <Head title="Student Registration" />

            {/* ── Stepper ── */}
            <div className="mb-10">
                <div className="flex items-center justify-between">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex flex-1 items-center">
                                {/* Step circle + label */}
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                            isCompleted
                                                ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                                : isActive
                                                  ? 'border-primary bg-primary/10 text-primary shadow-md shadow-primary/15'
                                                  : 'border-muted-foreground/30 bg-muted/50 text-muted-foreground'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5" strokeWidth={3} />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p
                                            className={`text-xs font-semibold whitespace-nowrap ${
                                                isActive
                                                    ? 'text-primary'
                                                    : isCompleted
                                                      ? 'text-foreground'
                                                      : 'text-muted-foreground'
                                            }`}
                                        >
                                            Step {step.id}
                                        </p>
                                        <p
                                            className={`text-[11px] whitespace-nowrap ${
                                                isActive
                                                    ? 'font-medium text-primary'
                                                    : 'text-muted-foreground'
                                            }`}
                                        >
                                            {step.title}
                                        </p>
                                    </div>
                                </div>

                                {/* Connector line */}
                                {idx < steps.length - 1 && (
                                    <div className="relative mx-4 mb-8 h-0.5 flex-1 rounded-full bg-muted-foreground/20">
                                        <div
                                            className={`absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500 ease-out ${
                                                isCompleted ? 'w-full' : 'w-0'
                                            }`}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Form ── */}
            <form onSubmit={submit} className="space-y-6">
                {/* Step 1 — Basic Information */}
                {currentStep === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
                        {/* Auto-generated row */}
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
                                    className="h-10"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    placeholder="Juan"
                                    required
                                />
                                <InputError message={errors.first_name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="middle_name">Middle Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                                <Input
                                    id="middle_name"
                                    className="h-10"
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    placeholder="Santos"
                                />
                                <InputError message={errors.middle_name} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="last_name"
                                    className="h-10"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    placeholder="Dela Cruz"
                                    required
                                />
                                <InputError message={errors.last_name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="suffix">Suffix <span className="text-muted-foreground text-xs">(optional)</span></Label>
                                <Input
                                    id="suffix"
                                    className="h-10"
                                    value={data.suffix}
                                    onChange={(e) => setData('suffix', e.target.value)}
                                    placeholder="Jr., Sr., III"
                                />
                                <InputError message={errors.suffix} />
                            </div>
                        </div>

                        {/* Details row */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender <span className="text-destructive">*</span></Label>
                                <Select value={data.gender} onValueChange={(val) => setData('gender', val)}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth <span className="text-destructive">*</span></Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    className="h-10"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    required
                                />
                                <InputError message={errors.date_of_birth} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="place_of_birth">Place of Birth <span className="text-muted-foreground text-xs">(optional)</span></Label>
                                <Input
                                    id="place_of_birth"
                                    className="h-10"
                                    value={data.place_of_birth}
                                    onChange={(e) => setData('place_of_birth', e.target.value)}
                                    placeholder="Manila, Philippines"
                                />
                                <InputError message={errors.place_of_birth} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nationality">Nationality <span className="text-destructive">*</span></Label>
                                <Input
                                    id="nationality"
                                    className="h-10"
                                    value={data.nationality}
                                    onChange={(e) => setData('nationality', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nationality} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2 — Address Information */}
                {currentStep === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="space-y-2">
                            <Label htmlFor="house_no">House No. / Building <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <Input
                                id="house_no"
                                className="h-10"
                                value={data.house_no}
                                onChange={(e) => setData('house_no', e.target.value)}
                                placeholder="Blk 5, Lot 12"
                            />
                            <InputError message={errors.house_no} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="street">Street <span className="text-destructive">*</span></Label>
                                <Input
                                    id="street"
                                    className="h-10"
                                    value={data.street}
                                    onChange={(e) => setData('street', e.target.value)}
                                    placeholder="Rizal Street"
                                    required
                                />
                                <InputError message={errors.street} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="barangay">Barangay <span className="text-destructive">*</span></Label>
                                <Input
                                    id="barangay"
                                    className="h-10"
                                    value={data.barangay}
                                    onChange={(e) => setData('barangay', e.target.value)}
                                    placeholder="Brgy. San Isidro"
                                    required
                                />
                                <InputError message={errors.barangay} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="city">City / Municipality <span className="text-destructive">*</span></Label>
                                <Input
                                    id="city"
                                    className="h-10"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Quezon City"
                                    required
                                />
                                <InputError message={errors.city} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="province">Province <span className="text-destructive">*</span></Label>
                                <Input
                                    id="province"
                                    className="h-10"
                                    value={data.province}
                                    onChange={(e) => setData('province', e.target.value)}
                                    placeholder="Metro Manila"
                                    required
                                />
                                <InputError message={errors.province} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zip_code">Zip Code <span className="text-destructive">*</span></Label>
                            <Input
                                id="zip_code"
                                className="h-10"
                                value={data.zip_code}
                                onChange={(e) => setData('zip_code', e.target.value)}
                                placeholder="1100"
                                required
                            />
                            <InputError message={errors.zip_code} />
                        </div>
                    </div>
                )}

                {/* Step 3 — Account / Completion */}
                {currentStep === 3 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                className="h-10"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                            <PasswordInput
                                id="password"
                                className="h-10"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Create a strong password"
                                required
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password <span className="text-destructive">*</span></Label>
                            <PasswordInput
                                id="password_confirmation"
                                className="h-10"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>
                )}

                {/* ── Navigation Buttons ── */}
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
                    {currentStep < 3 ? (
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

                {/* ── Login link ── */}
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
