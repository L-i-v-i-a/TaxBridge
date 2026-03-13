'use client';
import Image from "next/image";
import React, { useState } from 'react';
import NotificationModal from '../components/NotificationModal'; // Adjust path based on your folder structure

export default function Hero() {
  // State for form inputs
  const [annualIncome, setAnnualIncome] = useState('');
  const [federalTaxWithheld, setFederalTaxWithheld] = useState('');

  // State for result and UI feedback
  const [refundAmount, setRefundAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // State for Modal
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    type: 'error' as 'success' | 'error'
  });

  const showModal = (message: string, type: 'success' | 'error') => {
    setModalState({ isOpen: true, message, type });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const handleCalculate = async () => {
    // Reset previous result
    setRefundAmount(null);

    // 1. Validation
    if (!annualIncome || !federalTaxWithheld) {
      showModal("Please enter both income and tax withheld.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/refund-calculator/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          annualIncome: Number(annualIncome),
          federalTaxWithheld: Number(federalTaxWithheld),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // FIX: Use the correct key 'estimatedRefund' from backend
        const resultValue = data.estimatedRefund || 0;

        setRefundAmount(resultValue);

        // Show success modal
        const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(resultValue);
        showModal(`Calculation complete! Estimated refund: ${formattedAmount}`, 'success');
      } else {
        const errData = await response.json();
        showModal(errData.message || "Calculation failed.", "error");
      }
    } catch (err) {
      console.error('Network error:', err);
      showModal("Could not connect to the server. Is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D23AD] flex flex-col items-center">
      {/* Render Modal */}
      <NotificationModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        type={modalState.type}
        onClose={closeModal}
      />

      <main className="w-full max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-[#5FF7E2] font-bold tracking-wider text-sm mb-4">
              TAX FILING THAT ACTUALLY FITS YOUR LIFE
            </h1>
            <h2 className="text-4xl md:text-6xl text-white font-extrabold leading-[1.1]">
              Real humans on demand <br />
              <span className="text-white/80">+ AI accuracy.</span>
            </h2>
            <p className="text-xl text-blue-100 mt-6 max-w-lg">
              Fully compliant refund without the stress. Simplify financial management and make tax filing
              effortless.
            </p>
          </div>

          <div className="bg-white p-2 rounded-xl flex items-center shadow-2xl max-w-xl">
            <div className="flex items-center gap-3 px-4 flex-1">
              <span className="text-[#0D23AD] font-semibold">Try TaxBridge for Free</span>
            </div>
            <button className="bg-[#0D23AD] text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>

        {/* Right Column: Calculator Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-black">
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/ellipse.png"
                alt="profile"
                width={56}
                height={56}
                className="rounded-full w-14 h-14 object-cover border-2 border-blue-100"
              />
              <div>
                <h3 className="font-bold text-lg">Sarah - CPA</h3>
                <p className="text-gray-500 text-sm">Instant Refund Calculator</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center mb-8 border border-gray-100">
              {refundAmount !== null ? (
                <>
                  <span className="text-green-600 text-4xl font-black block">
                    ${refundAmount.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm">Estimated federal refund</span>
                </>
              ) : (
                <>
                  <span className="text-gray-400 text-4xl font-black block">$0</span>
                  <span className="text-gray-500 text-sm">Enter details to calculate</span>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm">Annual Income</label>
                <div className="bg-gray-100 p-4 rounded-xl font-bold text-gray-700 mt-1">
                  <input
                    type='number'
                    placeholder='50000'
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="bg-transparent w-full focus:outline-none text-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-600 text-sm">Federal Tax Withheld</label>
                <div className="bg-gray-100 p-4 rounded-xl font-bold text-gray-700 mt-1">
                  <input
                    type='number'
                    placeholder='7000'
                    value={federalTaxWithheld}
                    onChange={(e) => setFederalTaxWithheld(e.target.value)}
                    className="bg-transparent w-full focus:outline-none text-xl"
                  />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full bg-[#0D23AD] text-white py-5 rounded-2xl font-bold text-lg mt-4 hover:bg-blue-800 shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : 'Calculate'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
