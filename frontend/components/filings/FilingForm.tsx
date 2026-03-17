// components/filings/FilingForm.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Stepper from './Stepper';
import { ArrowLeft, Upload, FileText, CheckCircle, X } from 'lucide-react';

interface FilingFormProps {
  serviceType: 'CALCULATION_ONLY' | 'EXPERT_GUIDED' | 'FULL_FILING';
}

type FormData = {
  taxYear: string;
  taxType: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    taxId: string;
    address: string;
    country: string;
  };
  incomeDetails: {
    source: string;
    employmentType: string;
    grossIncome: string;
    multipleSources: 'Yes' | 'No';
    multipleEmployers: 'Yes' | 'No';
  };
  withholding?: {
    amount: string;
    type: string;
    datePaid: string;
    confirmationNumber: string;
  };
  deductions: {
    hasDeductibleExpenses: 'Yes' | 'No';
    medicalDental: 'Yes' | 'No';
    healthInsurance: 'Yes' | 'No';
    hasDependents: 'Yes' | 'No';
    numDependents?: string;
    dependentNames?: string;
    dependentAges?: string;
    charity: 'Yes' | 'No';
    donatedAmount?: string;
    ownsProperty: 'Yes' | 'No';
    mortgageInterest: 'Yes' | 'No';
  };
};

type DocumentCategory = 'identity' | 'income' | 'deduction' | 'business';

// Defined specific types for the API payloads to avoid using 'any'
interface IncomePayload {
  source: string;
  employmentType: string;
  grossIncome: string;
  withholdingAmount?: string;
}

interface DeductionsPayload {
  hasDeductibleExpenses: 'Yes' | 'No';
  hasDependents: 'Yes' | 'No';
  donationAmount?: number;
}

export default function FilingForm({ serviceType }: FilingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    taxYear: '2024',
    taxType: 'Federal',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      taxId: '',
      address: '',
      country: 'Nigeria',
    },
    incomeDetails: {
      source: '',
      employmentType: '',
      grossIncome: '',
      multipleSources: 'No',
      multipleEmployers: 'No',
    },
    withholding: serviceType !== 'CALCULATION_ONLY' ? {
      amount: '',
      type: '',
      datePaid: '',
      confirmationNumber: '',
    } : undefined,
    deductions: {
      hasDeductibleExpenses: 'No',
      medicalDental: 'No',
      healthInsurance: 'No',
      hasDependents: 'No',
      charity: 'No',
      ownsProperty: 'No',
      mortgageInterest: 'No',
    },
  });

  const [documents, setDocuments] = useState<Record<DocumentCategory, File[]>>({
    identity: [],
    income: [],
    deduction: [],
    business: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fileInputRefs = useRef<Record<DocumentCategory, HTMLInputElement | null>>({
    identity: null,
    income: null,
    deduction: null,
    business: null,
  });

  useEffect(() => {
    const country = formData.personalInfo.country.toLowerCase();
    if (country.includes('nigeria')) {
      setFormData((prev) => ({ ...prev, taxType: 'State / PAYE' }));
    } else if (country.includes('us') || country.includes('united states')) {
      setFormData((prev) => ({ ...prev, taxType: 'Federal' }));
    }
  }, [formData.personalInfo.country]);

  // Update Handlers
  const updatePersonal = (field: keyof FormData['personalInfo'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateIncome = (field: keyof FormData['incomeDetails'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      incomeDetails: { ...prev.incomeDetails, [field]: value },
    }));
  };

  const updateWithholding = (field: keyof NonNullable<FormData['withholding']>, value: string) => {
    if (!formData.withholding) return;
    setFormData((prev) => ({
      ...prev,
      withholding: { ...prev.withholding!, [field]: value },
    }));
  };

  const updateDeductions = (field: keyof FormData['deductions'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      deductions: { ...prev.deductions, [field]: value },
    }));
  };

  // File Handlers
  const addDocument = (category: DocumentCategory, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [category]: [...prev[category], file],
    }));
  };

  const removeDocument = (category: DocumentCategory, index: number) => {
    setDocuments((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleFileSelection = (category: DocumentCategory, files: FileList | null) => {
    if (files) {
      Array.from(files).forEach((file) => {
        addDocument(category, file);
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, category: DocumentCategory) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelection(category, e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Validation
  const validateCurrentStep = (): boolean => {
    const errs: string[] = [];

    if (step === 0) {
      const p = formData.personalInfo;
      if (!p.name) errs.push('Full name is required');
      if (!p.email) errs.push('Email is required');
      if (!p.phone) errs.push('Phone is required');
      if (!p.dob) errs.push('Date of birth is required');
      if (!p.gender) errs.push('Gender is required');
      if (!p.taxId) errs.push('Tax ID / TIN is required');
      if (!p.address) errs.push('Address is required');
      if (!p.country) errs.push('Country is required');
    }

    if (step === 1) {
      const i = formData.incomeDetails;
      if (!i.source) errs.push('Primary income source is required');
      if (!i.employmentType) errs.push('Employment type is required');
      if (!i.grossIncome) errs.push('Gross income is required');

      if (formData.withholding) {
        if (!formData.withholding.amount) errs.push('Withholding amount is required');
        if (!formData.withholding.type) errs.push('Withholding type is required');
      }
    }

    if (step === 2) {
      if (formData.deductions.hasDependents === 'Yes') {
        if (!formData.deductions.numDependents) errs.push('Number of dependents required');
      }
    }

    if (step === 3 && serviceType === 'FULL_FILING') {
      if (documents.identity.length === 0) errs.push('At least one identity document is required');
      if (documents.income.length === 0) errs.push('At least one income document is required');
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (step < 4) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // SUBMIT HANDLER
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);

    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const body = new FormData();
    body.append('taxYear', formData.taxYear);
    body.append('type', formData.taxType);
    body.append('personalInfo', JSON.stringify(formData.personalInfo));

    // --- FIX APPLIED: Typed payloads instead of 'any' ---
    
    // 1. Income Payload
    const incomePayload: IncomePayload = {
      source: formData.incomeDetails.source,
      employmentType: formData.incomeDetails.employmentType,
      grossIncome: formData.incomeDetails.grossIncome,
    };
    if (formData.withholding?.amount) {
      incomePayload.withholdingAmount = formData.withholding.amount;
    }
    body.append('incomeDetails', JSON.stringify(incomePayload));

    // 2. Deductions Payload
    const deductionsPayload: DeductionsPayload = {
      hasDeductibleExpenses: formData.deductions.hasDeductibleExpenses,
      hasDependents: formData.deductions.hasDependents,
    };
    if (formData.deductions.donatedAmount) {
      deductionsPayload.donationAmount = parseFloat(formData.deductions.donatedAmount);
    }
    body.append('deductions', JSON.stringify(deductionsPayload));

    // Append documents
    Object.values(documents).flat().forEach((file) => {
      body.append('documents', file);
    });

    try {
      const response = await fetch(`https://backend-production-c062.up.railway.app/filings?serviceType=${serviceType}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error('Submission error:', errorData);
        const message = errorData.message ? JSON.stringify(errorData.message) : 'Submission failed';
        alert(message);
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getSuccessTitle = () => {
    if (serviceType === 'CALCULATION_ONLY') return 'Tax Calculation Submitted';
    if (serviceType === 'EXPERT_GUIDED') return 'Filing Request Submitted';
    return 'Tax Return Submitted';
  };

  const getSuccessMessage = () => {
    if (serviceType === 'CALCULATION_ONLY')
      return 'Your tax estimate has been calculated. View results in your dashboard.';
    if (serviceType === 'EXPERT_GUIDED')
      return 'Our experts are reviewing your details. You will receive guidance soon.';
    return 'We are processing your full tax filing. You will receive confirmation and feedback shortly.';
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D23AD]/40 text-gray-800";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 md:p-8">
      <Stepper currentStep={step} />

      <div className="mt-6">
        <button onClick={() => router.back()} className="inline-flex items-center text-[#0D23AD] hover:underline mb-6 text-sm font-medium">
          <ArrowLeft size={16} className="mr-1.5" /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {serviceType === 'CALCULATION_ONLY' ? 'Calculate Tax' : serviceType === 'EXPERT_GUIDED' ? 'File Tax' : 'Calculate and File Tax'}
        </h1>
        <p className="text-gray-600 mb-8">Kindly fill in correct details for each section.</p>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Please correct the following:
            <ul className="list-disc pl-5 mt-2">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        {/* STEP 0: Personal */}
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClasses}>Full Name *</label><input className={inputClasses} value={formData.personalInfo.name} onChange={(e) => updatePersonal('name', e.target.value)} required /></div>
            <div><label className={labelClasses}>Email Address *</label><input type="email" className={inputClasses} value={formData.personalInfo.email} onChange={(e) => updatePersonal('email', e.target.value)} required /></div>
            <div><label className={labelClasses}>Phone Number *</label><input type="tel" className={inputClasses} value={formData.personalInfo.phone} onChange={(e) => updatePersonal('phone', e.target.value)} required /></div>
            <div><label className={labelClasses}>Date of Birth *</label><input type="date" className={inputClasses} value={formData.personalInfo.dob} onChange={(e) => updatePersonal('dob', e.target.value)} required /></div>
            <div><label className={labelClasses}>Gender *</label><select className={inputClasses} value={formData.personalInfo.gender} onChange={(e) => updatePersonal('gender', e.target.value)} required><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
            <div><label className={labelClasses}>Tax ID / TIN *</label><input className={inputClasses} value={formData.personalInfo.taxId} onChange={(e) => updatePersonal('taxId', e.target.value)} required /></div>
            <div className="md:col-span-2"><label className={labelClasses}>Full Address *</label><input className={inputClasses} value={formData.personalInfo.address} onChange={(e) => updatePersonal('address', e.target.value)} required /></div>
            <div><label className={labelClasses}>Country *</label><input className={inputClasses} value={formData.personalInfo.country} onChange={(e) => updatePersonal('country', e.target.value)} required /></div>
            <div><label className={labelClasses}>Tax Type</label><input className={`${inputClasses} bg-gray-50`} value={formData.taxType} readOnly /></div>
          </div>
        )}

        {/* STEP 1: Income */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div><label className={labelClasses}>Primary source of income? *</label><input className={inputClasses} placeholder="e.g. Salary, Business, Football" value={formData.incomeDetails.source} onChange={(e) => updateIncome('source', e.target.value)} required /></div>
              <div><label className={labelClasses}>Employment Type *</label><select className={inputClasses} value={formData.incomeDetails.employmentType} onChange={(e) => updateIncome('employmentType', e.target.value)} required><option value="">Select</option><option value="Employed">Employed</option><option value="Self Employed">Self Employed</option><option value="Business Owner">Business Owner</option></select></div>
              <div><label className={labelClasses}>Gross Annual Income (₦ or $) *</label><input type="number" className={inputClasses} placeholder="e.g. 5000000" value={formData.incomeDetails.grossIncome} onChange={(e) => updateIncome('grossIncome', e.target.value)} required /></div>
              <div><label className={labelClasses}>Earn income from multiple sources?</label><select className={inputClasses} value={formData.incomeDetails.multipleSources} onChange={(e) => updateIncome('multipleSources', e.target.value as 'Yes' | 'No')}><option value="No">No</option><option value="Yes">Yes</option></select></div>
              <div><label className={labelClasses}>Work for more than one employer?</label><select className={inputClasses} value={formData.incomeDetails.multipleEmployers} onChange={(e) => updateIncome('multipleEmployers', e.target.value as 'Yes' | 'No')}><option value="No">No</option><option value="Yes">Yes</option></select></div>
            </div>

            {formData.withholding && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Withholding Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClasses}>Amount Withheld</label><input type="number" className={inputClasses} value={formData.withholding.amount} onChange={(e) => updateWithholding('amount', e.target.value)} required /></div>
                  <div><label className={labelClasses}>Withholding Type</label><input className={inputClasses} placeholder="e.g. PAYE, WHT" value={formData.withholding.type} onChange={(e) => updateWithholding('type', e.target.value)} required /></div>
                  <div><label className={labelClasses}>Date Paid</label><input type="date" className={inputClasses} value={formData.withholding.datePaid} onChange={(e) => updateWithholding('datePaid', e.target.value)} /></div>
                  <div><label className={labelClasses}>Confirmation Number</label><input className={inputClasses} value={formData.withholding.confirmationNumber} onChange={(e) => updateWithholding('confirmationNumber', e.target.value)} /></div>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: Deductions */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className={labelClasses}>Any deductible expenses this year?</label><select className={inputClasses} value={formData.deductions.hasDeductibleExpenses} onChange={(e) => updateDeductions('hasDeductibleExpenses', e.target.value as 'Yes' | 'No')}><option value="No">No</option><option value="Yes">Yes</option></select></div>
              <div><label className={labelClasses}>Medical or dental expenses?</label><select className={inputClasses} value={formData.deductions.medicalDental} onChange={(e) => updateDeductions('medicalDental', e.target.value as 'Yes' | 'No')}><option value="No">No</option><option value="Yes">Yes</option></select></div>
              <div><label className={labelClasses}>Paid health insurance privately?</label><select className={inputClasses} value={formData.deductions.healthInsurance} onChange={(e) => updateDeductions('healthInsurance', e.target.value as 'Yes' | 'No')}><option value="No">No</option><option value="Yes">Yes</option></select></div>
              <div><label className={labelClasses}>Have dependents?</label><select className={inputClasses} value={formData.deductions.hasDependents} onChange={(e) => updateDeductions('hasDependents', e.target.value as 'Yes' | 'No')}><option value="No">No</option><option value="Yes">Yes</option></select></div>

              {formData.deductions.hasDependents === 'Yes' && (
                <>
                  <div><label className={labelClasses}>Number of dependents</label><input type="number" className={inputClasses} value={formData.deductions.numDependents || ''} onChange={(e) => updateDeductions('numDependents', e.target.value)} min="1" /></div>
                  <div className="md:col-span-2"><label className={labelClasses}>Names & ages (e.g. Soliu Umar, 24)</label><textarea className={inputClasses} rows={2} value={`${formData.deductions.dependentNames || ''} | ${formData.deductions.dependentAges || ''}`} onChange={(e) => { const [names, ages] = e.target.value.split('|').map(s => s.trim()); updateDeductions('dependentNames', names || ''); updateDeductions('dependentAges', ages || ''); }} /></div>
                </>
              )}

              <div><label className={labelClasses}>Donated to charity?</label><select className={inputClasses} value={formData.deductions.charity} onChange={(e) => updateDeductions('charity', e.target.value as 'Yes' | 'No')}><option value="No">No</option><option value="Yes">Yes</option></select></div>
              {formData.deductions.charity === 'Yes' && (
                <div><label className={labelClasses}>Total amount donated</label><input type="number" className={inputClasses} value={formData.deductions.donatedAmount || ''} onChange={(e) => updateDeductions('donatedAmount', e.target.value)} /></div>
              )}

              <div><label className={labelClasses}>Own home / property?</label><select className={inputClasses} value={formData.deductions.ownsProperty} onChange={(e) => updateDeductions('ownsProperty', e.target.value as 'Yes' | 'No')}><option value="No">No</option><option value="Yes">Yes</option></select></div>
              {formData.deductions.ownsProperty === 'Yes' && (
                <div><label className={labelClasses}>Paid mortgage interest?</label><select className={inputClasses} value={formData.deductions.mortgageInterest} onChange={(e) => updateDeductions('mortgageInterest', e.target.value as 'Yes' | 'No')}><option value="No">No</option><option value="Yes">Yes</option></select></div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Documents */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-[#0D23AD] mb-1">Documents Upload</h3>
              <p className="text-sm text-gray-600">{serviceType === 'FULL_FILING' ? 'All categories required for full filing' : 'Uploads help improve accuracy'}</p>
            </div>

            {(['identity', 'income', 'deduction', 'business'] as DocumentCategory[]).map((cat) => (
              <div key={cat} className="border rounded-xl p-5">
                <h4 className="font-medium mb-3 capitalize">{cat === 'identity' ? 'Identity Verification' : cat === 'income' ? 'Income Documents' : cat === 'deduction' ? 'Deduction & Credit Documents' : 'Business & Property Documents'}</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0D23AD]/60 transition-colors cursor-pointer" onClick={() => fileInputRefs.current[cat]?.click()} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, cat)}>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-1">Drag & drop or <span className="text-[#0D23AD] font-medium">browse</span></p>
                  <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG • Max 10MB per file</p>
                  <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" ref={(el) => { fileInputRefs.current[cat] = el; }} onChange={(e) => { handleFileSelection(cat, e.target.files); if(e.target) e.target.value = ''; }} className="hidden" />
                </div>

                {documents[cat].length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents[cat].map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <div className="flex items-center">
                          <FileText className="text-[#0D23AD] mr-3" size={20} />
                          <div><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
                        </div>
                        <button onClick={() => removeDocument(cat, idx)} className="text-red-500 hover:text-red-700"><X size={18} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* STEP 4: Review */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-[#0D23AD] mb-1">Review & Submit</h3>
              <p className="text-sm text-gray-600">Please verify all information before submitting.</p>
            </div>

            <div className="border rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Name:</span> {formData.personalInfo.name}</div>
                <div><span className="font-medium">Email:</span> {formData.personalInfo.email}</div>
                <div><span className="font-medium">Phone:</span> {formData.personalInfo.phone}</div>
                <div><span className="font-medium">Tax ID:</span> {formData.personalInfo.taxId}</div>
              </div>
            </div>

            <div className="border rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-4">Income Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Source:</span> {formData.incomeDetails.source}</div>
                <div><span className="font-medium">Gross Income:</span> {formData.incomeDetails.grossIncome}</div>
              </div>
            </div>

            <div className="border rounded-xl p-6 bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">Documents Attached</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div><p className="text-2xl font-bold text-[#0D23AD]">{documents.identity.length}</p><p className="text-sm text-gray-600">Identity</p></div>
                <div><p className="text-2xl font-bold text-[#0D23AD]">{documents.income.length}</p><p className="text-sm text-gray-600">Income</p></div>
                <div><p className="text-2xl font-bold text-[#0D23AD]">{documents.deduction.length}</p><p className="text-sm text-gray-600">Deductions</p></div>
                <div><p className="text-2xl font-bold text-[#0D23AD]">{documents.business.length}</p><p className="text-sm text-gray-600">Business</p></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex justify-between border-t pt-6">
          <button type="button" onClick={prevStep} disabled={step === 0} className={`px-8 py-3 rounded-lg font-medium transition-colors ${step === 0 ? 'text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Previous</button>
          {step < 4 ? (
            <button type="button" onClick={nextStep} className="px-10 py-3 bg-[#0D23AD] text-white font-medium rounded-lg hover:bg-[#0a1b8a] transition shadow-sm">Next</button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading} className={`px-10 py-3 font-medium rounded-lg transition shadow-sm ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>{loading ? 'Submitting...' : 'Submit'}</button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-10 text-center shadow-2xl">
            <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{getSuccessTitle()}</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{getSuccessMessage()}</p>
            <button onClick={() => router.push('/dashboard')} className="px-10 py-3 bg-[#0D23AD] text-white font-medium rounded-lg hover:bg-[#0a1b8a] transition">Return to Tax Filing</button>
          </div>
        </div>
      )}
    </div>
  );
}