import { Head, router } from '@inertiajs/react';
import { CalendarCheck, Mail, ShieldCheck } from 'lucide-react';
import { useCallback, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { PublicPageShell } from '@/features/public/components/PublicPageShell';

type Step = 'email' | 'otp';

export default function AttendanceAccess() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSendOtp = useCallback(async () => {
        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/attendance/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(
                        document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''
                    ),
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to send verification code.');
                return;
            }

            setSuccessMessage(data.message);
            setStep('otp');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [email]);

    const handleVerifyOtp = useCallback(async (code: string) => {
        if (code.length !== 6) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/attendance/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(
                        document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''
                    ),
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Invalid verification code.');
                setOtp('');
                return;
            }

            // OTP verified — user is now logged in, redirect to their dashboard
            router.visit(data.redirect);
        } catch {
            setError('Something went wrong. Please try again.');
            setOtp('');
        } finally {
            setLoading(false);
        }
    }, [email]);

    const handleOtpChange = (value: string) => {
        setOtp(value);
        if (value.length === 6) {
            handleVerifyOtp(value);
        }
    };

    const handleBack = () => {
        setStep('email');
        setOtp('');
        setError(null);
        setSuccessMessage(null);
    };

    return (
        <PublicPageShell activePage="attendance">
            <Head title="View Attendance Records" />

            <main className="pt-24">
                <section className="relative overflow-hidden py-16 sm:py-20">
                    <div className="absolute top-0 -left-10 h-72 w-72 rounded-full bg-[#FF3B30]/10 blur-[120px]" />
                    <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#FF3B30]/5 blur-[120px]" />

                    <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
                        {step === 'email' && (
                            <EmailStep
                                email={email}
                                setEmail={setEmail}
                                onSubmit={handleSendOtp}
                                loading={loading}
                                error={error}
                            />
                        )}

                        {step === 'otp' && (
                            <OtpStep
                                email={email}
                                otp={otp}
                                onOtpChange={handleOtpChange}
                                onResend={handleSendOtp}
                                onBack={handleBack}
                                loading={loading}
                                error={error}
                                successMessage={successMessage}
                            />
                        )}
                    </div>
                </section>
            </main>
        </PublicPageShell>
    );
}

function EmailStep({
    email,
    setEmail,
    onSubmit,
    loading,
    error,
}: {
    email: string;
    setEmail: (v: string) => void;
    onSubmit: () => void;
    loading: boolean;
    error: string | null;
}) {
    return (
        <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF3B30]/10">
                <CalendarCheck size={32} className="text-[#FF3B30]" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#1D1D1F]">View Attendance Records</h1>
            <p className="mb-8 text-[#1D1D1F]/60">
                Enter your registered email address to receive a one-time verification code.
            </p>

            <div className="mx-auto max-w-sm">
                <div className="overflow-hidden rounded-2xl border border-[#1D1D1F]/10 bg-white shadow-xl shadow-black/5">
                    <div className="p-6">
                        <label htmlFor="email" className="mb-2 block text-left text-sm font-semibold text-[#1D1D1F]">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#1D1D1F]/40" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                                placeholder="student@example.com"
                                className="w-full rounded-xl border border-[#1D1D1F]/10 bg-[#F5F5F7] py-3 pr-4 pl-10 text-sm text-[#1D1D1F] outline-none transition-all placeholder:text-[#1D1D1F]/40 focus:border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]/20"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="mt-3 text-left text-sm text-red-600">{error}</p>
                        )}

                        <button
                            onClick={onSubmit}
                            disabled={loading || !email.trim()}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF3B30] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF3B30]/20 transition-all hover:scale-[1.02] hover:bg-[#E0342B] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <Mail size={16} />
                            )}
                            {loading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                    </div>
                </div>

                <p className="mt-4 text-xs text-[#1D1D1F]/50">
                    A 6-digit code will be sent to your email. The code expires in 10 minutes.
                </p>
            </div>
        </div>
    );
}

function OtpStep({
    email,
    otp,
    onOtpChange,
    onResend,
    onBack,
    loading,
    error,
    successMessage,
}: {
    email: string;
    otp: string;
    onOtpChange: (v: string) => void;
    onResend: () => void;
    onBack: () => void;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}) {
    return (
        <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF3B30]/10">
                <ShieldCheck size={32} className="text-[#FF3B30]" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#1D1D1F]">Enter Verification Code</h1>
            <p className="mb-8 text-[#1D1D1F]/60">
                We sent a 6-digit code to <span className="font-semibold text-[#1D1D1F]">{email}</span>
            </p>

            <div className="mx-auto max-w-sm">
                <div className="overflow-hidden rounded-2xl border border-[#1D1D1F]/10 bg-white shadow-xl shadow-black/5">
                    <div className="flex flex-col items-center p-6">
                        {successMessage && (
                            <p className="mb-4 text-sm text-emerald-600">{successMessage}</p>
                        )}

                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={onOtpChange}
                            disabled={loading}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        {loading && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-[#1D1D1F]/60">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF3B30]/30 border-t-[#FF3B30]" />
                                Verifying...
                            </div>
                        )}

                        {error && (
                            <p className="mt-4 text-sm text-red-600">{error}</p>
                        )}

                        <div className="mt-6 flex items-center gap-4 text-sm">
                            <button
                                onClick={onBack}
                                className="font-medium text-[#1D1D1F]/60 transition-colors hover:text-[#1D1D1F]"
                            >
                                Change email
                            </button>
                            <span className="text-[#1D1D1F]/20">|</span>
                            <button
                                onClick={onResend}
                                disabled={loading}
                                className="font-medium text-[#FF3B30] transition-colors hover:text-[#E0342B] disabled:opacity-50"
                            >
                                Resend code
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
