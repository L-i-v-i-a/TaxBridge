"use client"; // Add this if using Next.js App Router and planning to handle form state

import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="bg-[#1e3a8a] min-h-screen p-8 lg:p-24 flex items-center justify-center">
      {/* Container holding both sides */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE: Information Card */}
        <div className="bg-[#0021A5] text-white p-10 lg:p-16 rounded-3xl shadow-xl h-full flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Reach out to us at anytime, we are active 24/7 for any of your enquiry. 
            We give a quick feedback for every enquiry.
          </p>

          <div className="space-y-8">
            {/* Email */}
            <div className="flex items-center gap-5">
              <div className="bg-[#FF7A00] p-3 rounded-lg">
                <Mail size={24} className="text-white" />
              </div>
              <span className="text-xl">example@taxbridge.com</span>
            </div>

            {/* Address */}
            <div className="flex items-start gap-5">
              <div className="bg-[#FF7A00] p-3 rounded-lg mt-1">
                <MapPin size={24} className="text-white" />
              </div>
              <div className="text-xl">
                <p>123, Atlanta United State.</p>
                <p>123, Gwarinpa, Abuja, Nigeria.</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-5">
              <div className="bg-[#FF7A00] p-3 rounded-lg">
                <Phone size={24} className="text-white" />
              </div>
              <span className="text-xl">+44 123 654 7890</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Contact Form */}
        <div className="bg-white p-10 lg:p-16 rounded-3xl shadow-xl">
          <form className="space-y-6">
            <div>
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full p-5 bg-[#F4F7FF] border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-5 bg-[#F4F7FF] border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Phone Number" 
                className="w-full p-5 bg-[#F4F7FF] border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              />
            </div>
            <div>
              <textarea 
                placeholder="Message" 
                rows={4}
                className="w-full p-5 bg-[#F4F7FF] border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#03045E] text-white font-bold py-5 rounded-xl hover:bg-black transition-all text-lg uppercase tracking-wide cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;