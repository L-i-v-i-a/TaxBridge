'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Sidebar from '../../../../../components/dashboard/Sidebar';
import TopBar from '../../../../../components/dashboard/Topbar';
import FilingForm from '../../../../../components/filings/FilingForm';

// 1. Extract the content component that uses useSearchParams
function NewFilingContent() {
  const searchParams = useSearchParams();
  // Default to CALCULATION_ONLY if param is missing
  const serviceType = (searchParams.get('service') as 'CALCULATION_ONLY' | 'EXPERT_GUIDED' | 'FULL_FILING') || 'CALCULATION_ONLY';

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">New Tax Filing</h1>
        <p className="text-gray-500 mt-1 capitalize">
          Service Type: {serviceType.replace(/_/g, ' ').toLowerCase()}
        </p>
      </div>

      {/* The Form Component */}
      <FilingForm serviceType={serviceType} />
    </>
  );
}

// 2. Default export wraps the content in Suspense
export default function NewFilingPage() {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={
              <div className="text-gray-500 text-center p-10">Loading form...</div>
            }>
              <NewFilingContent />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}