import type { Auth } from './auth';

export type * from './auth';
export type * from './navigation';
export type * from './ui';

export type SharedData = {
    auth: Auth;
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    [key: string]: unknown;
};
