import type { InertiaLinkProps } from '@inertiajs/react';
import { dashboard } from '@/routes';
import type { User } from '@/types';

export function dashboardUrlForRole(
    role?: User['role'] | null,
): NonNullable<InertiaLinkProps['href']> {
    return role === 'parent' ? '/parent/dashboard' : dashboard();
}
