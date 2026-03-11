import React from 'react';
import Nav from './nav';
export default function Hero() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-6 pt-0 pb-10">
            <div className="w-full max-w-7xl h-24 relative p-12">
                <h1 className="text-2xl font-bold text-left text-[#5FF7E2] leading-tight mb-2">
                    TAX FILLING THAT ACTUALLY FITS YOUR LIFE
                </h1>
                <p className="text-3xl text-left text-white font-bold">
                   <span> Real humans on demand + AI accuracy.
                    <br />
                    Fully compliant refund without the stress.
                    </span>
                </p>
                <form className='bg-white w-xl mt-8 rounded-md p-4 flex items-center justify-between space-x-2'>
                    <div className='flex items-center gap-2'>
                        <svg width="38" height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M32.1697 35.6969H6.82387C5.01407 35.6969 3.27839 34.978 1.99867 33.6982C0.718942 32.4185 0 30.6828 0 28.873V3.41608C0 1.33577 2.05886 0.0158367 3.87011 0.643633C4.13007 0.733318 4.38158 0.864597 4.62464 1.03747L4.96583 1.28118C5.79572 1.87003 6.78854 2.18554 7.80612 2.18379C8.8237 2.18205 9.81543 1.86313 10.6433 1.27143C11.8054 0.444404 13.1963 0 14.6226 0C16.0489 0 17.4398 0.444404 18.6019 1.27143C19.4297 1.86313 20.4215 2.18205 21.4391 2.18379C22.4566 2.18554 23.4495 1.87003 24.2793 1.28118L24.6205 1.03747C26.5566 -0.346803 29.2452 1.03747 29.2452 3.41608V18.1498H36.069C36.4569 18.1498 36.8288 18.3039 37.103 18.5781C37.3773 18.8523 37.5313 19.2242 37.5313 19.6121V30.3353C37.5313 31.7573 36.9664 33.121 35.9609 34.1265C34.9554 35.132 33.5917 35.6969 32.1697 35.6969ZM29.7326 21.0743V30.3353C29.7326 30.9816 29.9894 31.6015 30.4464 32.0586C30.9035 32.5156 31.5233 32.7724 32.1697 32.7724C32.8161 32.7724 33.4359 32.5156 33.893 32.0586C34.35 31.6015 34.6068 30.9816 34.6068 30.3353V21.0743H29.7326ZM21.4465 12.7882C21.4465 12.4004 21.2924 12.0284 21.0182 11.7542C20.7439 11.48 20.372 11.3259 19.9842 11.3259H8.28613C7.89832 11.3259 7.52639 11.48 7.25216 11.7542C6.97793 12.0284 6.82387 12.4004 6.82387 12.7882C6.82387 13.176 6.97793 13.5479 7.25216 13.8222C7.52639 14.0964 7.89832 14.2504 8.28613 14.2504H19.9842C20.372 14.2504 20.7439 14.0964 21.0182 13.8222C21.2924 13.5479 21.4465 13.176 21.4465 12.7882ZM19.4968 18.6372C19.4968 18.2494 19.3427 17.8775 19.0685 17.6032C18.7943 17.329 18.4223 17.175 18.0345 17.175H8.28613C7.89832 17.175 7.52639 17.329 7.25216 17.6032C6.97793 17.8775 6.82387 18.2494 6.82387 18.6372C6.82387 19.025 6.97793 19.397 7.25216 19.6712C7.52639 19.9454 7.89832 20.0995 8.28613 20.0995H18.0345C18.4223 20.0995 18.7943 19.9454 19.0685 19.6712C19.3427 19.397 19.4968 19.025 19.4968 18.6372ZM19.9842 23.024C20.372 23.024 20.7439 23.1781 21.0182 23.4523C21.2924 23.7265 21.4465 24.0984 21.4465 24.4863C21.4465 24.8741 21.2924 25.246 21.0182 25.5202C20.7439 25.7945 20.372 25.9485 19.9842 25.9485H8.28613C7.89832 25.9485 7.52639 25.7945 7.25216 25.5202C6.97793 25.246 6.82387 24.8741 6.82387 24.4863C6.82387 24.0984 6.97793 23.7265 7.25216 23.4523C7.52639 23.1781 7.89832 23.024 8.28613 23.024H19.9842Z" fill="#0D23AD"/>
                        </svg>
                        <h1 className='text-[#0D23AD] font-bold text-lg'>Try TaxBridge for Free</h1>
                    </div>
                    <button className="bg-[#0D23AD] text-white hover:bg-blue-400 px-6 py-3 rounded-md text-lg font-medium justify-center flex">
                        Get Started
                    </button>
                </form>
                <div className='py-8'>
                <h1> Simplify financial management and make tax filling effortless...</h1>
                </div>
                {/* testimonial card moved to top right */}
            <div className='absolute top-0 right-0 left-180 bg-white w-auto flex flex-col text-2xl text-black justify-start items-start gap-6 rounded-md py-2 p-4'>
                <form action="card" className='flex items-center gap-4 py-2 righ-0 p-4 w-auto'>
                    {/* use existing public image asset */}
                    <div className='flex flex-col top-6 w-auto p-2 '>
                        <div className='flex items-center gap-6'>
                            <img
                             src="/ellipse.png"
                              alt="profile" 
                              className='rounded-full w-16 h-16 object-cover'/>
                            <h1 className='font-bold'>Sarah • CPA</h1>
                        </div>
                        <div className='flex flex-col justify-center font-sm'>
                        <p>SaraInstant Refund Calculatorh • CPA</p>
                        </div>
                        <button className='bg-[#F0F0F0] rounded-md py-6 px-8 flex flex-col items-center justify-center text-green-500 font-bold mt-6'>
                            $2,485
                        
                            <span className='text-black font-normal text-sm'>Estimated federal refund</span>
                        </button>
                        <h1 className='font-sm'>Annual Income</h1>
                        <button className='bg-[#F0F0F0] rounded-md py-6 px-8 flex flex-col 
                        items-center items-start text-gray-500 font-sm mt-6'>5000</button>
                        <h1 className='font-sm'>Federal Tax Withheld</h1>
                        <button className='bg-[#F0F0F0] rounded-md py-6 px-8 flex flex-col 
                        items-center items-start text-gray-500 font-sm mt-6'>5000</button>
                        <button className='bg-[#0D23AD] rounded-full py-6 px-6 flex flex-col items-center mt-6 
                        text-white hover:bg-blue-700 hover:scale-105 transition-transform duration-300'>Calculate</button>
                    </div>
                </form>
            </div>
            </div>
            <section>
                <img 
                src="/cpa.png" 
                alt="cpa-meeting" />
            </section>
        </div>
    );
    
}
