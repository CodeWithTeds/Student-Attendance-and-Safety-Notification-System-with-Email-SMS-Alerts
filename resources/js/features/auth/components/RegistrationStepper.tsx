/**
 * RegistrationStepper — Reusable step progress indicator.
 * Shows completed, active, and upcoming steps with icons and connector lines.
 */

import { Check } from 'lucide-react';
import type { StepConfig } from '../types/registerTypes';

interface RegistrationStepperProps {
    steps: StepConfig[];
    currentStep: number;
}

export default function RegistrationStepper({ steps, currentStep }: RegistrationStepperProps) {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-1 items-center">
                            {/* Step circle + label */}
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                        isCompleted
                                            ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                            : isActive
                                              ? 'border-primary bg-primary/10 text-primary shadow-md shadow-primary/15'
                                              : 'border-muted-foreground/30 bg-muted/50 text-muted-foreground'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" strokeWidth={3} />
                                    ) : (
                                        <Icon className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <p
                                        className={`text-xs font-semibold whitespace-nowrap ${
                                            isActive
                                                ? 'text-primary'
                                                : isCompleted
                                                  ? 'text-foreground'
                                                  : 'text-muted-foreground'
                                        }`}
                                    >
                                        Step {step.id}
                                    </p>
                                    <p
                                        className={`text-[11px] whitespace-nowrap ${
                                            isActive
                                                ? 'font-medium text-primary'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                            </div>

                            {/* Connector line */}
                            {idx < steps.length - 1 && (
                                <div className="relative mx-4 mb-8 h-0.5 flex-1 rounded-full bg-muted-foreground/20">
                                    <div
                                        className={`absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500 ease-out ${
                                            isCompleted ? 'w-full' : 'w-0'
                                        }`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
