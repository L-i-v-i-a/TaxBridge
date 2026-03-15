'use client';
import React from 'react';

interface StepperProps {
  currentStep: number;
}

const steps = [
  { title: 'Personal Info', description: 'Your details' },
  { title: 'Income', description: 'Earnings & Withholdings' },
  { title: 'Deductions', description: 'Expenses & Donations' },
  { title: 'Documents', description: 'Upload files' },
];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 top-5 w-full h-1 bg-gray-200 z-0" />
        
        {/* Active Progress Line */}
        <div 
            className="absolute left-0 top-5 h-1 bg-[#0D23AD] z-0 transition-all duration-500" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} 
        />

        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center w-1/4">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-[#0D23AD] text-white shadow-lg' 
                  : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-center hidden md:block">
              <p className={`text-sm font-semibold ${index <= currentStep ? 'text-gray-800' : 'text-gray-400'}`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;