import React from 'react';
import Nav from './nav';
import Image from 'next/image';
import WhoWeAre from './features/whoWeAre';

export default function Hero() {
  return (
    <div className="min-h-screen bg-[#0D23AD] flex flex-col items-center">
      {/* Navbar would go here */}
      

      <main className="w-full max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text & CTA */}
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-[#5FF7E2] font-bold tracking-wider text-sm mb-4">
              TAX FILING THAT ACTUALLY FITS YOUR LIFE
            </h1>
            <h2 className="text-4xl md:text-6xl text-white font-extrabold leading-[1.1]">
              Real humans on demand <br /> 
              <span className="text-white">+ AI accuracy.</span>
            </h2>
            <p className="text-xl text-blue-100 mt-6 max-w-lg">
              Fully compliant refund without the stress. Simplify financial management and make tax filing effortless.
            </p>
          </div>

          {/* Email/Get Started Bar */}
          <div className="bg-white p-2 rounded-xl flex items-center shadow-2xl max-w-xl">
            <div className="flex items-center gap-3 px-4 flex-1 cursor-pointer">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0D23AD]/10 text-[#0D23AD]">
                <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd"  d="M37.0439 41.9181H11.6981C9.88828 41.9181 8.1526 41.1992 6.87287 
                  39.9194C5.59315 38.6397 4.87421 36.904 4.87421 35.0942V9.63727C4.87421 7.55696 6.93307 6.23703 8.74432 6.86482C9.00428 
                  6.95451 9.25578 7.08579 9.49884 7.25866L9.84004 7.50237C10.6699 8.09123 11.6627 8.40673 12.6803 8.40498C13.6979 8.40324
                   14.6896 8.08432 15.5175 7.49262C16.6796 6.6656 18.0705 6.22119 19.4968 6.22119C20.9231 6.22119 22.314 6.6656 23.4761 
                   7.49262C24.304 8.08432 25.2957 8.40324 26.3133 8.40498C27.3308 8.40673 28.3237 8.09123 29.1536 7.50237L29.4947 
                   7.25866C31.4308 5.87439 34.1194 7.25866 34.1194 9.63727V24.371H40.9433C41.3311 24.371 41.703 24.525 41.9772 
                   24.7993C42.2515 25.0735 42.4055 25.4454 42.4055 25.8332V36.5565C42.4055 37.9785 41.8406 39.3422 40.8351 
                   40.3477C39.8296 41.3532 38.4659 41.9181 37.0439 41.9181ZM34.6068 27.2955V36.5565C34.6068 37.2028 34.8636 
                   37.8227 35.3206 38.2798C35.7777 38.7368 36.3975 38.9936 37.0439 38.9936C37.6903 38.9936 38.3101 38.7368 
                   38.7672 38.2798C39.2242 37.8227 39.481 37.2028 39.481 36.5565V27.2955H34.6068ZM26.3207 19.0094C26.3207 
                   18.6216 26.1666 18.2496 25.8924 17.9754C25.6182 17.7012 25.2462 17.5471 24.8584 17.5471H13.1603C12.7725 
                   17.5471 12.4006 17.7012 12.1264 17.9754C11.8521 18.2496 11.6981 18.6216 11.6981 19.0094C11.6981 19.3972 
                   11.8521 19.7691 12.1264 20.0433C12.4006 20.3176 12.7725 20.4716 13.1603 20.4716H24.8584C25.2462 20.4716 
                   25.6182 20.3176 25.8924 20.0433C26.1666 19.7691 26.3207 19.3972 26.3207 19.0094ZM24.371 24.8584C24.371 
                   24.4706 24.2169 24.0987 23.9427 23.8244C23.6685 23.5502 23.2965 23.3961 22.9087 23.3961H13.1603C12.7725
                    23.3961 12.4006 23.5502 12.1264 23.8244C11.8521 24.0987 11.6981 24.4706 11.6981 24.8584C11.6981 25.2462
                     11.8521 25.6182 12.1264 25.8924C12.4006 26.1666 12.7725 26.3207 13.1603 26.3207H22.9087C23.2965 26.3207
                      23.6685 26.1666 23.9427 25.8924C24.2169 25.6182 24.371 25.2462 24.371 24.8584ZM24.8584 29.2452C25.2462
                       29.2452 25.6182 29.3992 25.8924 29.6735C26.1666 29.9477 26.3207 30.3196 26.3207 30.7074C26.3207 31.0953
                        26.1666 31.4672 25.8924 31.7414C25.6182 32.0156 25.2462 32.1697 24.8584 32.1697H13.1603C12.7725 32.1697 12.4006 32.0156 12.1264 31.7414C11.8521 31.4672 11.6981 31.0953 11.6981 30.7074C11.6981 30.3196 11.8521 29.9477 12.1264 29.6735C12.4006 29.3992 12.7725 29.2452 13.1603 29.2452H24.8584Z" fill="#0D23AD"/>
                  </svg>

              </span>

              <span className="text-[#0D23AD] font-semibold">Try TaxBridge for Free</span>
            </div>
            <button className="bg-[#0D23AD] text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors cursor-pointer">
              Get Started
            </button>
          </div>
        </div>

        {/* Right Column: Calculator Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-black">
            <div className="flex items-center gap-4 mb-8">
              <img
                src="/ellipse.png"
                alt="profile"
                className="rounded-full w-14 h-14 object-cover border-2 border-blue-100"
              />
              <div>
                <h3 className="font-bold text-lg">Sarah • CPA</h3>
                <p className="text-gray-500 text-sm">SaraInstant Refund Calculatorh • CPA</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center mb-8 border border-gray-100">
              <span className="text-green-600 text-4xl font-black block">$2,485</span>
              <span className="text-gray-500 text-sm">Estimated federal refund</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 ml-1">Annual Income</label>
                <div className="bg-gray-100 p-4 rounded-xl font-bold text-gray-700 mt-1">$50,000</div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 ml-1">Federal Tax Withheld</label>
                <div className="bg-gray-100 p-4 rounded-xl font-bold text-gray-700 mt-1">$5,000</div>
              </div>

              <button className="w-full bg-[#0D23AD] text-white py-5 rounded-2xl font-bold text-lg mt-4 cursor-pointer hover:bg-blue-800 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
                Calculate
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}