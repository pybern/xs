import { Check } from 'lucide-react'
import Link from "next/link"

interface Step {
  title: string
  subtitle: string
  icon: React.ReactNode
  href: string
}

interface ProgressStepsProps {
  currentStep: number
  steps: Step[]
  completedSteps: number[]
}

export function ProgressSteps({ currentStep, steps, completedSteps = [] }: ProgressStepsProps) {
  return (
    <div className="w-full flex justify-center px-4 sm:px-0">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex-grow flex-basis-0 flex flex-col items-center">
              <Link
                href={step.href}
                className={`relative flex flex-col items-center ${
                  index <= currentStep
                    ? "cursor-pointer text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background ${
                    completedSteps.includes(index)
                      ? "border-primary bg-primary text-primary-foreground"
                      : index === currentStep
                      ? "border-primary"
                      : "border-muted"
                  }`}
                >
                  {completedSteps.includes(index) ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-xs sm:text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="flex flex-col items-center text-center mt-2">
                  <span className="text-xs sm:text-sm font-medium hidden sm:block">{step.title}</span>
                  <span className="text-[10px] sm:text-xs hidden sm:block">{step.subtitle}</span>
                </div>
              </Link>
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 sm:top-5 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                    completedSteps.includes(index) ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

