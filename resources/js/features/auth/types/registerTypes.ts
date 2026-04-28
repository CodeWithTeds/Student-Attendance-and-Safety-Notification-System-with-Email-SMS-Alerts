/**
 * Registration form data types.
 * Shared across schemas, components, and the register page.
 */

export interface RegisterFormData {
    student_id: string;
    student_number: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    gender: string;
    date_of_birth: string;
    place_of_birth: string;
    nationality: string;
    house_no: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    zip_code: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export type StepErrors = Record<string, string>;

export interface StepConfig {
    id: number;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
}
