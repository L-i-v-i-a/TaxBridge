'use client';
import React from 'react';
import { Calculator, FileCheck, FileText } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: 'File Tax',
    description: 'Expert & AI Guided Filing. Best for complex tax situations.',
    icon: FileText,
    href: '/filings/new?service=EXPERT_GUIDED',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    title: 'Calculate Tax',
    description: 'Smart Calculator Analysis. Estimate your refund instantly.',
    icon: Calculator,
    href: '/filings/new?service=CALCULATION_ONLY',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'Calculate & File Tax',
    description: 'End-to-End Service. We calculate and file for you.',
    icon: FileCheck,
    href: '/filings/new?service=FULL_FILING',
    color: 'bg-[#0D23AD] hover:bg-[#0A1C8B]',
  },
];

const ServiceOptions = () => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Start a New Filing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <Link 
            key={service.title} 
            href={service.href}
            className="group block p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-gray-200"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg text-white ${service.color} transition-colors`}>
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900 group-hover:text-[#0D23AD]">
                {service.title}
              </h3>
            </div>
            <p className="text-sm text-gray-500">{service.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiceOptions;