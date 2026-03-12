import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react'; // Using lucide-react for icons

const ContactUs = () => {
  return (
    <section className="relative min-h-screen bg-blue-900 flex items-center justify-center p-6 lg:p-20 overflow-hidden">
      {/* Background Overlay to mimic the image texture */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.jpg')] opacity-20 bg-cover bg-center"></div>
      
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Info Box */}
        <div className="bg-[#001a99] p-10 lg:p-16 text-white flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-blue-100 mb-12 text-lg">
            Reach out to us at anytime, we are active 24/7 for any of your enquiry. 
            We give a quick feedback for every enquiry.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500 p-2 rounded">
                <Mail size={20} className="text-white" />
              </div>
              <span className="text-lg">example@taxbridge.com</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-500 p-2 rounded">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="text-lg">
                <p>123, Atlanta United State.</p>
                <p>123, Kwaripa, Abuja, Nigeria.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-500 p-2 rounded">
                <Phone size={20} className="text-white" />
              </div>
              <span className="text-lg">+44 123 654 7890</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white p-10 lg:p-16 flex flex-col justify-center">
          <form className="space-y-6">
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full p-4 bg-blue-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-4 bg-blue-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input 
              type="text" 
              placeholder="Phone Number" 
              className="w-full p-4 bg-blue-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea 
              placeholder="Message" 
              rows={5}
              className="w-full p-4 bg-blue-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
            
            <button 
              type="submit" 
              className="w-full bg-[#050a30] text-white font-semibold py-4 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;