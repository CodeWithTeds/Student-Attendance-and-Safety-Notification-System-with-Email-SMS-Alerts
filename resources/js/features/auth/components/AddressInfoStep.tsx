/**
 * AddressInfoStep — Step 2 of student registration.
 * Handles address information fields.
 */

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RegisterFormData, StepErrors } from '../types/registerTypes';

interface AddressInfoStepProps {
    data: RegisterFormData;
    stepErrors: StepErrors;
    onChange: <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => void;
}

export default function AddressInfoStep({ data, stepErrors, onChange }: AddressInfoStepProps) {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="space-y-2">
                <Label htmlFor="house_no">House No. / Building <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <Input
                    id="house_no"
                    className="h-10"
                    value={data.house_no}
                    onChange={(e) => onChange('house_no', e.target.value)}
                    placeholder="Blk 5, Lot 12"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="street">Street <span className="text-destructive">*</span></Label>
                    <Input
                        id="street"
                        className={`h-10 ${stepErrors.street ? 'border-destructive' : ''}`}
                        value={data.street}
                        onChange={(e) => onChange('street', e.target.value)}
                        placeholder="Rizal Street"
                    />
                    <InputError message={stepErrors.street} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="barangay">Barangay <span className="text-destructive">*</span></Label>
                    <Input
                        id="barangay"
                        className={`h-10 ${stepErrors.barangay ? 'border-destructive' : ''}`}
                        value={data.barangay}
                        onChange={(e) => onChange('barangay', e.target.value)}
                        placeholder="Brgy. San Isidro"
                    />
                    <InputError message={stepErrors.barangay} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="city">City / Municipality <span className="text-destructive">*</span></Label>
                    <Input
                        id="city"
                        className={`h-10 ${stepErrors.city ? 'border-destructive' : ''}`}
                        value={data.city}
                        onChange={(e) => onChange('city', e.target.value)}
                        placeholder="Quezon City"
                    />
                    <InputError message={stepErrors.city} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="province">Province <span className="text-destructive">*</span></Label>
                    <Input
                        id="province"
                        className={`h-10 ${stepErrors.province ? 'border-destructive' : ''}`}
                        value={data.province}
                        onChange={(e) => onChange('province', e.target.value)}
                        placeholder="Metro Manila"
                    />
                    <InputError message={stepErrors.province} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="zip_code">Zip Code <span className="text-destructive">*</span></Label>
                <Input
                    id="zip_code"
                    className={`h-10 ${stepErrors.zip_code ? 'border-destructive' : ''}`}
                    value={data.zip_code}
                    onChange={(e) => onChange('zip_code', e.target.value)}
                    placeholder="1100"
                />
                <InputError message={stepErrors.zip_code} />
            </div>
        </div>
    );
}
