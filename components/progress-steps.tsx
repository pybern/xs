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
    <nav className="w-full bg-background border-b">
      <div className="container mx-auto px-4">
        <ul className="flex overflow-x-auto">
          {steps.map((step, index) => (
            <li key={step.title} className="flex-shrink-0">
              <Link
                href={step.href}
                className={`flex items-center px-3 py-4 border-b-2 text-sm font-medium ${
                  index === currentStep
                    ? "border-primary text-primary"
                    : completedSteps.includes(index)
                    ? "border-green-500 text-green-500"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                <span className="hidden sm:inline mr-2">
                  {completedSteps.includes(index) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full border border-current">
                      {index + 1}
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap">{step.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

