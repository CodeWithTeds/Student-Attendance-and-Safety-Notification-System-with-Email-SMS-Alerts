/**
 * Registration form validation schemas.
 * Separated from components for reuse and testability.
 *
 * Each step has its own validation function that returns
 * field-level error messages keyed by field name.
 */

import type { RegisterFormData, StepErrors } from '../types/registerTypes';

// ── Helpers ──

function required(value: string, label: string): string | null {
    return value.trim() ? null : `${label} is required.`;
}

function minLength(value: string, min: number, label: string): string | null {
    return value.trim().length >= min
        ? null
        : `${label} must be at least ${min} characters.`;
}

function isEmail(value: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim()) ? null : 'Please enter a valid email address.';
}

function matchesField(value: string, other: string, label: string): string | null {
    return value === other ? null : `${label} does not match.`;
}

// ── Step 1: Basic Information ──

export function validateBasicInfo(data: RegisterFormData): StepErrors {
    const errors: StepErrors = {};

    const firstNameErr = required(data.first_name, 'First name');
    if (firstNameErr) errors.first_name = firstNameErr;

    const lastNameErr = required(data.last_name, 'Last name');
    if (lastNameErr) errors.last_name = lastNameErr;

    const genderErr = required(data.gender, 'Gender');
    if (genderErr) errors.gender = genderErr;

    const dobErr = required(data.date_of_birth, 'Date of birth');
    if (dobErr) errors.date_of_birth = dobErr;

    const nationalityErr = required(data.nationality, 'Nationality');
    if (nationalityErr) errors.nationality = nationalityErr;

    return errors;
}

// ── Step 2: Address Information ──

export function validateAddressInfo(data: RegisterFormData): StepErrors {
    const errors: StepErrors = {};

    const streetErr = required(data.street, 'Street');
    if (streetErr) errors.street = streetErr;

    const barangayErr = required(data.barangay, 'Barangay');
    if (barangayErr) errors.barangay = barangayErr;

    const cityErr = required(data.city, 'City / Municipality');
    if (cityErr) errors.city = cityErr;

    const provinceErr = required(data.province, 'Province');
    if (provinceErr) errors.province = provinceErr;

    const zipErr = required(data.zip_code, 'Zip code');
    if (zipErr) errors.zip_code = zipErr;

    return errors;
}

// ── Step 3: Completion (Account) ──

export function validateCompletion(data: RegisterFormData): StepErrors {
    const errors: StepErrors = {};

    const emailReq = required(data.email, 'Email');
    if (emailReq) {
        errors.email = emailReq;
    } else {
        const emailFmt = isEmail(data.email);
        if (emailFmt) errors.email = emailFmt;
    }

    const pwdReq = required(data.password, 'Password');
    if (pwdReq) {
        errors.password = pwdReq;
    } else {
        const pwdLen = minLength(data.password, 8, 'Password');
        if (pwdLen) errors.password = pwdLen;
    }

    const confirmReq = required(data.password_confirmation, 'Confirm password');
    if (confirmReq) {
        errors.password_confirmation = confirmReq;
    } else {
        const confirmMatch = matchesField(data.password_confirmation, data.password, 'Password confirmation');
        if (confirmMatch) errors.password_confirmation = confirmMatch;
    }

    return errors;
}

// ── Validate by step number ──

export function validateStep(step: number, data: RegisterFormData): StepErrors {
    switch (step) {
        case 1:
            return validateBasicInfo(data);
        case 2:
            return validateAddressInfo(data);
        case 3:
            return validateCompletion(data);
        default:
            return {};
    }
}

export function hasErrors(errors: StepErrors): boolean {
    return Object.keys(errors).length > 0;
}
