'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NotificationModal from '../NotificationModal';

interface Props {
  serviceType: 'CALCULATION_ONLY' | 'EXPERT_GUIDED' | 'FULL_FILING';
}

const FilingForm: React.FC<Props> = ({ serviceType }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  // Modal State
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });

  // Form State
  const [formData, setFormData] = useState({
    taxYear: '2024',
    type: 'Federal',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      address: '',
      taxId: '',
      country: '',
    },
    incomeDetails: {
      source: '',
      employmentType: '',
      grossIncome: '',
      withholdingAmount: '',
    },
    deductions: {
      hasDeductibleExpenses: 'No',
      hasDependents: 'No',
      donationAmount: '',
    },
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev] as any,
        [field]: value
      }
    }));
  };

  const handleTopLevelChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Prepare FormData
    const body = new FormData();
    body.append('taxYear', formData.taxYear);
    body.append('type', formData.type);
    
    // Stringify JSON objects
    body.append('personalInfo', JSON.stringify(formData.personalInfo));
    body.append('incomeDetails', JSON.stringify(formData.incomeDetails));
    body.append('deductions', JSON.stringify(formData.deductions));

    // Append files
    files.forEach((file) => {
      body.append('documents', file);
    });

    try {
      const response = await fetch(`http://localhost:3000/filings?serviceType=${serviceType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: body,
      });

      const result = await response.json();

      if (response.ok) {
        setModal({ 
          isOpen: true, 
          message: `Filing ${result.filingId} created successfully! Amount: $${result.amount}`, 
          type: 'success' 
        });
        // Optional: Redirect after delay
        setTimeout(() => router.push('/filings'), 2000);
      } else {
        setModal({ 
          isOpen: true, 
          message: result.message || 'Submission failed.', 
          type: 'error' 
        });
      }
    } catch (error) {
      setModal({ isOpen: true, message: 'Network error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Top Level Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tax Year</label>
              <input 
                type="number" 
                className={inputClass} 
                value={formData.taxYear} 
                onChange={(e) => handleTopLevelChange('taxYear', e.target.value)} 
              />
            </div>
            <div>
              <label className={labelClass}>Filing Type</label>
              <select 
                className={inputClass} 
                value={formData.type} 
                onChange={(e) => handleTopLevelChange('type', e.target.value)}
              >
                <option value="Federal">Federal</option>
                <option value="State">State</option>
                <option value="Federal & State">Federal & State</option>
              </select>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" className={inputClass} value={formData.personalInfo.name} onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} value={formData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" className={inputClass} value={formData.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input type="date" className={inputClass} value={formData.personalInfo.dob} onChange={(e) => handleInputChange('personalInfo', 'dob', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select className={inputClass} value={formData.personalInfo.gender} onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input type="text" className={inputClass} value={formData.personalInfo.address} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Tax ID (SSN/EIN)</label>
              <input type="text" className={inputClass} value={formData.personalInfo.taxId} onChange={(e) => handleInputChange('personalInfo', 'taxId', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input type="text" className={inputClass} value={formData.personalInfo.country} onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Income Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Income Source</label>
              <input type="text" className={inputClass} placeholder="e.g. Salary, Business" value={formData.incomeDetails.source} onChange={(e) => handleInputChange('incomeDetails', 'source', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Employment Type</label>
              <select className={inputClass} value={formData.incomeDetails.employmentType} onChange={(e) => handleInputChange('incomeDetails', 'employmentType', e.target.value)}>
                <option value="">Select</option>
                <option value="Employed">Employed</option>
                <option value="Self Employed">Self Employed</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Gross Income ($)</label>
              <input type="number" className={inputClass} placeholder="50000" value={formData.incomeDetails.grossIncome} onChange={(e) => handleInputChange('incomeDetails', 'grossIncome', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Tax Withheld ($)</label>
              <input type="number" className={inputClass} placeholder="5000" value={formData.incomeDetails.withholdingAmount} onChange={(e) => handleInputChange('incomeDetails', 'withholdingAmount', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Deductions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label className={labelClass}>Donation Amount ($)</label>
              <input type="number" className={inputClass} placeholder="0" value={formData.deductions.donationAmount} onChange={(e) => handleInputChange('deductions', 'donationAmount', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Documents Upload */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange} 
              className="hidden" 
              id="file-upload" 
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="text-sm text-gray-500 font-medium">Click to upload files (PDF, JPG, PNG)</p>
                <p className="text-xs text-gray-400 mt-1">Max 10 files</p>
              </div>
            </label>
            
            {/* Display Selected Files */}
            {files.length > 0 && (
              <div className="mt-4 text-left">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 rounded-lg text-sm font-semibold text-white bg-[#0D23AD] hover:bg-[#0A1C8B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Filing'}
          </button>
        </div>
      </form>

      <NotificationModal 
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </>
  );
};

export default FilingForm;