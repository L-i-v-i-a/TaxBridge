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
              <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clipRule="evenodd" d="M37.0439 41.9181H11.6981C9.88828 41.9181 8.1526
               41.1992 6.87287 39.9194C5.59315 38.6397 4.87421 36.904 4.87421 35.0942V9.63727C4.87421 7.55696
                6.93307 6.23703 8.74432 6.86482C9.00428 6.95451 9.25578 7.08579 9.49884 7.25866L9.84004
                 7.50237C10.6699 8.09123 11.6627 8.40673 12.6803 8.40498C13.6979 8.40324 14.6896 8.08432
                  15.5175 7.49262C16.6796 6.6656 18.0705 6.22119 19.4968 6.22119C20.9231 6.22119 22.314
                   6.6656 23.4761 7.49262C24.304 8.08432 25.2957 8.40324 26.3133 8.40498C27.3308 8.40673
                    28.3237 8.09123 29.1536 7.50237L29.4947 7.25866C31.4308 5.87439 34.1194 7.25866 34.1194
                     9.63727V24.371H40.9433C41.3311 24.371 41.703 24.525 41.9772 24.7993C42.2515 25.0735 42.4055
                      25.4454 42.4055 25.8332V36.5565C42.4055 37.9785 41.8406 39.3422 40.8351 40.3477C39.8296
                       41.3532 38.4659 41.9181 37.0439 41.9181ZM34.6068 27.2955V36.5565C34.6068 37.2028 34.8636
                        37.8227 35.3206 38.2798C35.7777 38.7368 36.3975 38.9936 37.0439 38.9936C37.6903 38.9936
                         38.3101 38.7368 38.7672 38.2798C39.2242 37.8227 39.481 37.2028 39.481 36.5565V27.2955H34.6068ZM26.3207
                          19.0094C26.3207 18.6216 26.1666 18.2496 25.8924 17.9754C25.6182 17.7012 25.2462 17.5471 24.8584
                           17.5471H13.1603C12.7725 17.5471 12.4006 17.7012 12.1264 17.9754C11.8521 18.2496 11.6981 18.6216
                            11.6981 19.0094C11.6981 19.3972 11.8521 19.7691 12.1264 20.0433C12.4006 20.3176 12.7725 20.4716
                             13.1603 20.4716H24.8584C25.2462 20.4716 25.6182 20.3176 25.8924 20.0433C26.1666 19.7691 26.3207
                              19.3972 26.3207 19.0094ZM24.371 24.8584C24.371 24.4706 24.2169 24.0987 23.9427 23.8244C23.6685
                               23.5502 23.2965 23.3961 22.9087 23.3961H13.1603C12.7725 23.3961 12.4006 23.5502 12.1264
                                23.8244C11.8521 24.0987 11.6981 24.4706 11.6981 24.8584C11.6981 25.2462 11.8521 25.6182
                                 12.1264 25.8924C12.4006 26.1666 12.7725 26.3207 13.1603 26.3207H22.9087C23.2965 26.3207
                                  23.6685 26.1666 23.9427 25.8924C24.2169 25.6182 24.371 25.2462 24.371 24.8584ZM24.8584
                                   29.2452C25.2462 29.2452 25.6182 29.3992 25.8924 29.6735C26.1666 29.9477 26.3207 30.3196
                                    26.3207 30.7074C26.3207 31.0953 26.1666 31.4672 25.8924 31.7414C25.6182 32.0156 25.2462
                                     32.1697 24.8584 32.1697H13.1603C12.7725 32.1697 12.4006 32.0156 12.1264 31.7414C11.8521
                                      31.4672 11.6981 31.0953 11.6981 30.7074C11.6981 30.3196 11.8521 29.9477 12.1264
                                       29.6735C12.4006 29.3992 12.7725 29.2452 13.1603 29.2452H24.8584Z" fill="#0D23AD"/>
              </svg>

              <span className="text-[#0D23AD] font-semibold">Try TaxBridge for Free</span>
            </div>
            <button className="bg-[#0D23AD] text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors cursor-pointer">
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
                className="w-full bg-[#0D23AD] text-white py-5 rounded-2xl font-bold text-lg mt-4 hover:bg-blue-800 shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
