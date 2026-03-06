"use client";

interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition ${
                  isCompleted
                    ? "bg-primary-600 text-white"
                    : isCurrent
                    ? "bg-primary-100 text-primary-600 border-2 border-primary-500"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent ? "text-primary-600" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  isCompleted ? "bg-primary-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
