'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Stepper from './Stepper';
import NotificationModal from '../NotificationModal';

interface Props {
  serviceType: 'CALCULATION_ONLY' | 'EXPERT_GUIDED' | 'FULL_FILING';
}

const FilingForm: React.FC<Props> = ({ serviceType }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState({
    taxYear: '2024',
    type: 'Federal',
    personalInfo: { name: '', email: '', phone: '', dob: '', gender: '', address: '', taxId: '', country: '' },
    incomeDetails: { source: '', employmentType: '', grossIncome: '', withholdingAmount: '' },
    deductions: { hasDeductibleExpenses: 'No', hasDependents: 'No', donationAmount: '' },
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev] as any, [field]: value }
    }));
  };

  const handleTopLevelChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => (prev < 3 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    const body = new FormData();
    body.append('taxYear', formData.taxYear);
    body.append('type', formData.type);
    body.append('personalInfo', JSON.stringify(formData.personalInfo));
    body.append('incomeDetails', JSON.stringify(formData.incomeDetails));
    body.append('deductions', JSON.stringify(formData.deductions));
    files.forEach((file) => body.append('documents', file));

    try {
      const response = await fetch(`http://localhost:3000/filings?serviceType=${serviceType}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: body,
      });
      const result = await response.json();
      if (response.ok) {
        setModal({ isOpen: true, message: `Success! Filing ID: ${result.filingId}`, type: 'success' });
        setTimeout(() => router.push('/filings'), 2000);
      } else {
        setModal({ isOpen: true, message: result.message || 'Error submitting form.', type: 'error' });
      }
    } catch (error) {
      setModal({ isOpen: true, message: 'Network error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 border border-gray-300 text-sm";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <Stepper currentStep={currentStep} />

      <form onSubmit={(e) => e.preventDefault()}>
        
        {/* STEP 1: Personal Info */}
        {currentStep === 0 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" className={inputClass} value={formData.personalInfo.name} onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" className={inputClass} value={formData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="tel" className={inputClass} value={formData.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" className={inputClass} value={formData.personalInfo.dob} onChange={(e) => handleInputChange('personalInfo', 'dob', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select className={inputClass} value={formData.personalInfo.gender} onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input type="text" className={inputClass} value={formData.personalInfo.country} onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Full Address</label>
                <input type="text" className={inputClass} value={formData.personalInfo.address} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Tax ID (SSN/EIN)</label>
                <input type="text" className={inputClass} value={formData.personalInfo.taxId} onChange={(e) => handleInputChange('personalInfo', 'taxId', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Income Details */}
        {currentStep === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Income Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Income Source</label>
                <input type="text" className={inputClass} placeholder="e.g. Salary, Rental" value={formData.incomeDetails.source} onChange={(e) => handleInputChange('incomeDetails', 'source', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Employment Type</label>
                <select className={inputClass} value={formData.incomeDetails.employmentType} onChange={(e) => handleInputChange('incomeDetails', 'employmentType', e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="Employed">Employed</option>
                  <option value="Self Employed">Self Employed</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Gross Income ($)</label>
                <input type="number" className={inputClass} placeholder="80000" value={formData.incomeDetails.grossIncome} onChange={(e) => handleInputChange('incomeDetails', 'grossIncome', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Tax Withheld ($)</label>
                <input type="number" className={inputClass} placeholder="5000" value={formData.incomeDetails.withholdingAmount} onChange={(e) => handleInputChange('incomeDetails', 'withholdingAmount', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Deductions */}
        {currentStep === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Deductions</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Has Deductible Expenses?</label>
                  <select className={inputClass} value={formData.deductions.hasDeductibleExpenses} onChange={(e) => handleInputChange('deductions', 'hasDeductibleExpenses', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Has Dependents?</label>
                  <select className={inputClass} value={formData.deductions.hasDependents} onChange={(e) => handleInputChange('deductions', 'hasDependents', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Donation Amount ($)</label>
                <input type="number" className={inputClass} placeholder="200" value={formData.deductions.donationAmount} onChange={(e) => handleInputChange('deductions', 'donationAmount', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Documents & Review */}
        {currentStep === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Documents & Finalize</h2>
            
            {/* File Upload */}
            <div className="mb-8">
              <label className={labelClass}>Upload Documents (Optional)</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-lg hover:border-gray-300 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-[#0D23AD] hover:text-blue-500">
                      <span>Upload files</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                </div>
              </div>
              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file, i) => <li key={i} className="text-sm text-gray-600 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>{file.name}</li>)}
                </ul>
              )}
            </div>

            {/* Review Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Tax Year:</strong> {formData.taxYear}</p>
                <p><strong>Filing Type:</strong> {formData.type}</p>
                <p><strong>Service:</strong> {serviceType.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between border-t pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${currentStep === 0 ? 'opacity-0 cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0D23AD] hover:bg-[#0A1C8B] transition-colors shadow-sm"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Filing'}
            </button>
          )}
        </div>
      </form>

      <NotificationModal 
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
      
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FilingForm;