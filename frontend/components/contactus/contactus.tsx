"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';import { motion } from 'framer-motion';import NotificationModal from '../../components/NotificationModal'; // Adjust path as needed

const ContactUs = () => {
  // Animation variants
  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  };

  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);

  // State for Modal
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const showModal = (message: string, type: 'success' | 'error') => {
    setModalState({ isOpen: true, message, type });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      showModal("Please fill in all required fields.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://backend-production-c062.up.railway.app/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showModal("Message sent successfully! We will get back to you soon.", "success");
        // Clear form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        showModal(errorData.message || "Failed to send message.", "error");
      }
    } catch (error) {
      console.error(error);
      showModal("Could not connect to the server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-blue-900 bg-[url('/document.jpg')] bg-center bg-repeat bg-blend-overlay min-h-screen pt-20 p-16 lg:p-30 ">
        {/* Container holding both sides */}
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE: Information Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={fadeInLeft}
            className="bg-[#0021A5] text-white p-10 lg:p-16 rounded-3xl shadow-xl h-full flex flex-col justify-center"
          >
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
          </motion.div>

          {/* RIGHT SIDE: Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            variants={fadeInRight}
            className="bg-white p-10 lg:p-16 rounded-3xl shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-5 bg-[#F4F7FF] border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  required
                />
              </div>
              <div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-5 bg-[#F4F7FF] border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  required
                />
              </div>
              <div>
                <input 
                  type="text" 
                  name="phone"
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-5 bg-[#F4F7FF] border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-5 bg-[#F4F7FF] border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#03045E] text-white font-bold py-5 rounded-xl hover:bg-black transition-all text-lg uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </motion.div>

        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal 
        isOpen={modalState.isOpen}
        message={modalState.message}
        type={modalState.type}
        onClose={closeModal}
      />
    </>
  );
};

export default ContactUs;