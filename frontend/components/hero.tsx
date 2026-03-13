"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NotificationModal from '../components/NotificationModal'; 

export default function Hero() {
  // Animation variants
  const fadeInRight = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  };

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
    setRefundAmount(null);

    if (!annualIncome || !federalTaxWithheld) {
      showModal("Please enter both income and tax withheld.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/refund-calculator/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annualIncome: Number(annualIncome),
          federalTaxWithheld: Number(federalTaxWithheld),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const resultValue = data.estimatedRefund || 0;
        setRefundAmount(resultValue);
        
        const formattedAmount = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
        }).format(resultValue);
        
        showModal(`Calculation complete! Estimated refund: ${formattedAmount}`, 'success');
      } else {
        const errData = await response.json();
        showModal(errData.message || "Calculation failed.", "error");
      }
    } catch (err) {
      showModal("Could not connect to the server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center overflow-hidden">
      
      <NotificationModal 
        isOpen={modalState.isOpen}
        message={modalState.message}
        type={modalState.type}
        onClose={closeModal}
      />

      <main className="w-full max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeInRight}
          className="flex flex-col space-y-8"
        >
          <div>
            <h1 className="text-[#5FF7E2] font-bold tracking-wider text-sm mb-4">
              TAX FILING THAT ACTUALLY FITS YOUR LIFE
            </h1>
            <h2 className="text-4xl md:text-6xl text-white font-extrabold leading-[1.1]">
              Real humans on demand <br />
              <span className="text-white/80">+ AI accuracy.</span>
            </h2>
            <p className="text-xl text-blue-100 mt-6 max-w-lg">
              Fully compliant refund without the stress.
            </p>
          </div>

          <div className="bg-white p-2 rounded-xl flex items-center shadow-2xl max-w-xl transition-all hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
            <div className="flex items-center gap-3 px-4 flex-1">
              <span className="text-[#0D23AD] font-semibold">Try TaxBridge for Free</span>
            </div>
            <button className="bg-[#0D23AD] text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors">
              Get Started
            </button>
          </div>
        </motion.div>

        {/* Right Column: Calculator Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          variants={fadeInLeft}
          className="flex justify-center lg:justify-end"
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-black">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                <img 
                src="ellipse.png" 
                alt="Sarah • CPA"
                className='rounded-full'
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Sarah • CPA</h3>
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
        </motion.div>

      </main>
    </div>
  );
}
