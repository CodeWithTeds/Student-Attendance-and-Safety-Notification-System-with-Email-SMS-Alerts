import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { usePage } from '@inertiajs/react';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    const { url } = usePage();

    if (url.startsWith('/register')) {
        return (
            <AuthSplitLayout
                title={title}
                description={description}
                image="/images/image.png"
            >
                {children}
            </AuthSplitLayout>
        );
    }

    return (
        <AuthLayoutTemplate title={title} description={description}>
            {children}
        </AuthLayoutTemplate>
    );
}
