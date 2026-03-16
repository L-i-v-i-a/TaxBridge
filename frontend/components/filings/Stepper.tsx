// components/filings/Stepper.tsx
'use client';

import React from 'react';

interface StepperProps {
  currentStep: number; // 0-based
  totalSteps?: number;
}

const steps = [
  { title: 'Personal Info', description: 'Basic details' },
  { title: 'Income', description: 'Earnings & withholding' },
  { title: 'Deductions', description: 'Credits & expenses' },
  { title: 'Documents', description: 'Upload files' },
  { title: 'Review', description: 'Check & submit' },
];

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps = steps.length }) => {
  return (
    <div className="mb-10">
      <div className="relative flex items-center justify-between">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200" />

        {/* Progress line */}
        <div
          className="absolute left-0 top-5 h-1 bg-[#0D23AD] transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />

        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-all duration-300 ${
                index < currentStep
                  ? 'bg-[#0D23AD] text-white shadow-md'
                  : index === currentStep
                  ? 'bg-white border-4 border-[#0D23AD] text-[#0D23AD] shadow-lg'
                  : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <div className="mt-3 text-center">
              <p
                className={`text-sm font-semibold ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.title}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 hidden md:block">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;