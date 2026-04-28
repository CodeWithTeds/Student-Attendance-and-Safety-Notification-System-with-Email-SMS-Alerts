/**
 * Registration form validation schemas.
 * Separated from components for reuse and testability.
 *
 * Each step has its own validation function that returns
 * field-level error messages keyed by field name.
 */

import type { RegisterFormData, StepErrors } from '../types/registerTypes';

// ── Validation Helpers ──

function required(value: string, label: string): string | null {
    return value.trim() ? null : `${label} is required.`;
}

function minLength(value: string, min: number, label: string): string | null {
    return value.trim().length >= min
        ? null
        : `${label} must be at least ${min} characters.`;
}

function maxLength(value: string, max: number, label: string): string | null {
    return value.trim().length <= max
        ? null
        : `${label} must not exceed ${max} characters.`;
}

function lettersOnly(value: string, label: string): string | null {
    const regex = /^[a-zA-ZÀ-ÿñÑ\s'\-\.]+$/;
    return regex.test(value.trim()) ? null : `${label} must contain letters only.`;
}

function alphaWithPunctuation(value: string, label: string): string | null {
    const regex = /^[a-zA-Z0-9À-ÿñÑ\s'\-\.\,#\/]+$/;
    return regex.test(value.trim()) ? null : `${label} contains invalid characters.`;
}

function digitsOnly(value: string, label: string): string | null {
    const regex = /^[0-9]+$/;
    return regex.test(value.trim()) ? null : `${label} must contain numbers only.`;
}

function isEmail(value: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim()) ? null : 'Please enter a valid email address.';
}

function matchesField(value: string, other: string, label: string): string | null {
    return value === other ? null : `${label} does not match.`;
}

// ── Composed validators ──

function validateName(value: string, label: string, isRequired: boolean): string | null {
    if (isRequired) {
        const req = required(value, label);
        if (req) return req;
    } else if (!value.trim()) {
        return null; // optional and empty — skip
    }

    const len = minLength(value, 2, label);
    if (len) return len;

    const max = maxLength(value, 100, label);
    if (max) return max;

    const letters = lettersOnly(value, label);
    if (letters) return letters;

    return null;
}

function validateAlphaField(value: string, label: string, isRequired: boolean): string | null {
    if (isRequired) {
        const req = required(value, label);
        if (req) return req;
    } else if (!value.trim()) {
        return null;
    }

    const letters = lettersOnly(value, label);
    if (letters) return letters;

    return null;
}

function validateAddressField(value: string, label: string, isRequired: boolean): string | null {
    if (isRequired) {
        const req = required(value, label);
        if (req) return req;
    } else if (!value.trim()) {
        return null;
    }

    const fmt = alphaWithPunctuation(value, label);
    if (fmt) return fmt;

    return null;
}

// ── Step 1: Basic Information ──

export function validateBasicInfo(data: RegisterFormData): StepErrors {
    const errors: StepErrors = {};

    const firstName = validateName(data.first_name, 'First name', true);
    if (firstName) errors.first_name = firstName;

    const middleName = validateName(data.middle_name, 'Middle name', false);
    if (middleName) errors.middle_name = middleName;

    const lastName = validateName(data.last_name, 'Last name', true);
    if (lastName) errors.last_name = lastName;

    // Suffix — optional, letters & dots only (e.g. Jr., Sr., III)
    if (data.suffix.trim()) {
        const suffixRegex = /^[a-zA-Z\s\.]+$/;
        if (!suffixRegex.test(data.suffix.trim())) {
            errors.suffix = 'Suffix must contain letters and periods only.';
        }
    }

    const gender = required(data.gender, 'Gender');
    if (gender) errors.gender = gender;

    const dob = required(data.date_of_birth, 'Date of birth');
    if (dob) errors.date_of_birth = dob;

    const placeOfBirth = validateAlphaField(data.place_of_birth, 'Place of birth', false);
    if (placeOfBirth) errors.place_of_birth = placeOfBirth;

    const nationality = validateAlphaField(data.nationality, 'Nationality', true);
    if (nationality) errors.nationality = nationality;

    return errors;
}

// ── Step 2: Address Information ──

export function validateAddressInfo(data: RegisterFormData): StepErrors {
    const errors: StepErrors = {};

    const houseNo = validateAddressField(data.house_no, 'House No.', false);
    if (houseNo) errors.house_no = houseNo;

    const street = validateAddressField(data.street, 'Street', true);
    if (street) errors.street = street;

    const barangay = validateAlphaField(data.barangay, 'Barangay', true);
    if (barangay) errors.barangay = barangay;

    const city = validateAlphaField(data.city, 'City / Municipality', true);
    if (city) errors.city = city;

    const province = validateAlphaField(data.province, 'Province', true);
    if (province) errors.province = province;

    const zipReq = required(data.zip_code, 'Zip code');
    if (zipReq) {
        errors.zip_code = zipReq;
    } else {
        const zipDigits = digitsOnly(data.zip_code, 'Zip code');
        if (zipDigits) errors.zip_code = zipDigits;

        const zipLen = maxLength(data.zip_code, 4, 'Zip code');
        if (zipLen) errors.zip_code = zipLen;
    }

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
