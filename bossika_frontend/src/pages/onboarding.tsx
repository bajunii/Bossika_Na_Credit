import { useState } from 'react';
import BusinessDetailsStep from '@/components/onboarding/BusinessDetailsStep';
import GoalsStep from '@/components/onboarding/GoalsStep';
import IncomeExpenseStep from '@/components/onboarding/IncomeExpenseStep';
import { Progress } from '@/components/ui/progress';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = () => {
    // Redirect handled in IncomeExpenseStep
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">Welcome to Bossika Na Credit</h1>
          <p className="text-center text-muted-foreground mb-4 text-sm sm:text-base">
            Let's set up your business profile
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>

        {currentStep === 1 && <BusinessDetailsStep onNext={handleNext} />}
        {currentStep === 2 && <GoalsStep onNext={handleNext} onBack={handleBack} />}
        {currentStep === 3 && (
          <IncomeExpenseStep onComplete={handleComplete} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
