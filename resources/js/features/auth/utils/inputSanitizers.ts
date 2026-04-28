/**
 * Input sanitizers for form fields.
 *
 * These functions strip disallowed characters in real-time
 * so users cannot type invalid input (e.g. numbers in a name field).
 * Use these in onChange handlers to sanitize before setting state.
 */

/** Letters, spaces, hyphens, apostrophes, and periods only (for names). */
export function sanitizeName(value: string): string {
    return value.replace(/[^a-zA-ZÀ-ÿñÑ\s'\-\.]/g, '');
}

/** Letters and spaces only (for nationality, place of birth, province, city, barangay). */
export function sanitizeAlpha(value: string): string {
    return value.replace(/[^a-zA-ZÀ-ÿñÑ\s'\-\.,]/g, '');
}

/** Alphanumeric, spaces, hyphens, periods, commas (for street, house_no, place_of_birth). */
export function sanitizeAddress(value: string): string {
    return value.replace(/[^a-zA-Z0-9À-ÿñÑ\s'\-\.\,#\/]/g, '');
}

/** Digits only (for zip code). */
export function sanitizeDigits(value: string): string {
    return value.replace(/[^0-9]/g, '');
}

/** Letters, digits, and common suffix characters like periods (for suffix: Jr., Sr., III). */
export function sanitizeSuffix(value: string): string {
    return value.replace(/[^a-zA-Z\s\.]/g, '');
}
