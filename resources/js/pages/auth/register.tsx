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
import { CheckCircle2, Circle, CircleDot } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const steps = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Address Information' },
    { id: 3, title: 'Completion' },
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
        // Generate values on component mount
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
        } else {
            alert('Please fill out all required fields before proceeding.');
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    return (
        <>
            <Head title="Register" />

            <div className="mb-8">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center">
                        {steps.map((step, stepIdx) => (
                            <li
                                key={step.title}
                                className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                                            currentStep > step.id
                                                ? 'bg-primary'
                                                : currentStep === step.id
                                                  ? 'border-2 border-primary bg-background'
                                                  : 'border-2 border-muted bg-background'
                                        }`}
                                    >
                                        {currentStep > step.id ? (
                                            <CheckCircle2
                                                className="h-5 w-5 text-primary-foreground"
                                                aria-hidden="true"
                                            />
                                        ) : currentStep === step.id ? (
                                            <CircleDot
                                                className="h-5 w-5 text-primary"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Circle
                                                className="h-5 w-5 text-muted-foreground"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </div>
                                    <div className="absolute -bottom-6 left-1/2 w-max -translate-x-1/2 text-xs font-medium text-muted-foreground">
                                        {step.title}
                                    </div>
                                </div>
                                {stepIdx !== steps.length - 1 ? (
                                    <div
                                        className="absolute top-4 left-0 -z-10 mt-0.5 -ml-px h-0.5 w-full bg-muted"
                                        aria-hidden="true"
                                    >
                                        <div
                                            className={`h-full bg-primary transition-all duration-300 ease-in-out ${
                                                currentStep > step.id
                                                    ? 'w-full'
                                                    : 'w-0'
                                            }`}
                                        />
                                    </div>
                                ) : null}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            <form onSubmit={submit} className="mt-6 flex flex-col gap-6">
                {currentStep === 1 && (
                    <div className="grid animate-in gap-4 duration-500 fade-in slide-in-from-right-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="student_id">
                                Student ID (Auto-generated)
                            </Label>
                            <Input
                                id="student_id"
                                type="text"
                                value={data.student_id}
                                disabled
                                className="bg-muted text-muted-foreground"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="student_number">
                                Student Number
                            </Label>
                            <Input
                                id="student_number"
                                type="text"
                                value={data.student_number}
                                disabled
                                className="bg-muted text-muted-foreground"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name *</Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="middle_name">Middle Name</Label>
                            <Input
                                id="middle_name"
                                value={data.middle_name}
                                onChange={(e) =>
                                    setData('middle_name', e.target.value)
                                }
                            />
                            <InputError message={errors.middle_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name *</Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.last_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="suffix">Suffix</Label>
                            <Input
                                id="suffix"
                                value={data.suffix}
                                onChange={(e) =>
                                    setData('suffix', e.target.value)
                                }
                                placeholder="Jr., Sr., III"
                            />
                            <InputError message={errors.suffix} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender *</Label>
                            <Select
                                value={data.gender}
                                onValueChange={(val) => setData('gender', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date_of_birth">
                                Date of Birth *
                            </Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) =>
                                    setData('date_of_birth', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.date_of_birth} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="place_of_birth">
                                Place of Birth
                            </Label>
                            <Input
                                id="place_of_birth"
                                value={data.place_of_birth}
                                onChange={(e) =>
                                    setData('place_of_birth', e.target.value)
                                }
                            />
                            <InputError message={errors.place_of_birth} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nationality">Nationality *</Label>
                            <Input
                                id="nationality"
                                value={data.nationality}
                                onChange={(e) =>
                                    setData('nationality', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.nationality} />
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="grid animate-in gap-4 duration-500 fade-in slide-in-from-right-4 sm:grid-cols-2">
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="house_no">
                                House No. / Building (Optional)
                            </Label>
                            <Input
                                id="house_no"
                                value={data.house_no}
                                onChange={(e) =>
                                    setData('house_no', e.target.value)
                                }
                            />
                            <InputError message={errors.house_no} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="street">Street *</Label>
                            <Input
                                id="street"
                                value={data.street}
                                onChange={(e) =>
                                    setData('street', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.street} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="barangay">Barangay *</Label>
                            <Input
                                id="barangay"
                                value={data.barangay}
                                onChange={(e) =>
                                    setData('barangay', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.barangay} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city">City/Municipality *</Label>
                            <Input
                                id="city"
                                value={data.city}
                                onChange={(e) =>
                                    setData('city', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.city} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="province">Province *</Label>
                            <Input
                                id="province"
                                value={data.province}
                                onChange={(e) =>
                                    setData('province', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.province} />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="zip_code">Zip Code *</Label>
                            <Input
                                id="zip_code"
                                value={data.zip_code}
                                onChange={(e) =>
                                    setData('zip_code', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.zip_code} />
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="grid animate-in gap-4 duration-500 fade-in slide-in-from-right-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                                placeholder="name@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password *</Label>
                            <PasswordInput
                                id="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                required
                                placeholder="Create a strong password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm Password *
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                                placeholder="Confirm your password"
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-4 flex gap-4 border-t pt-4">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            className="w-full"
                        >
                            Back
                        </Button>
                    )}
                    {currentStep < 3 ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            className="w-full"
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {processing && <Spinner className="mr-2" />}
                            Complete Registration
                        </Button>
                    )}
                </div>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        href={login.url()}
                        className="font-medium underline underline-offset-4 hover:text-primary"
                    >
                        Log in
                    </Link>
                </div>
            </form>
        </>
    );
}

Register.layout = {
    title: 'Student Registration',
    description: 'Enter your details below to create your student account',
};
