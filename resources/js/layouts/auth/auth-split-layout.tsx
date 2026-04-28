import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

interface AuthSplitLayoutProps extends AuthLayoutProps {
    image?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
    image,
}: AuthSplitLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="flex h-dvh w-full">
            {/* Left Panel — Image */}
            <div className="relative hidden w-1/2 lg:block">
                {image ? (
                    <img
                        src={image}
                        alt="Registration"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-zinc-900" />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                {/* Logo on top of image */}
                <div className="relative z-10 flex h-full flex-col justify-between p-10">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 text-lg font-semibold text-white"
                    >
                        <AppLogoIcon className="size-8 fill-current text-white" />
                        {name}
                    </Link>
                    <div className="space-y-2">
                        <p className="text-2xl font-bold text-white">
                            Start your learning journey
                        </p>
                        <p className="max-w-sm text-sm text-white/70">
                            Register to access your student portal and manage
                            your academic records.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex w-full flex-col lg:w-1/2">
                {/* Mobile logo */}
                <div className="flex items-center p-6 lg:hidden">
                    <Link href={home()} className="flex items-center gap-2">
                        <AppLogoIcon className="h-8 fill-current text-black dark:text-white" />
                        <span className="font-semibold">{name}</span>
                    </Link>
                </div>

                {/* Scrollable form area */}
                <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10 lg:px-16">
                    <div className="w-full max-w-[540px] space-y-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
