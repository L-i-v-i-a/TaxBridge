"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import NotificationModal from '../../components/NotificationModal'; // Adjust path as needed

const ContactUs = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Scroll-based card animation
  const cardScale1 = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.03, 1]);
  const cardRotate1 = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const cardScale2 = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.02, 1]);
  const cardRotate2 = useTransform(scrollYProgress, [0, 1], [2, -2]);
  const cardScale3 = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.015, 1]);
  const cardRotate3 = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  // Animation variants
  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.12, delayChildren: 0.12 }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.12, delayChildren: 0.12 }
    }
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  const hoverable = {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 }
  };

  const cardFloat = {
    hidden: { opacity: 0, y: 24 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 * custom }
    })
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
      <motion.div
        ref={sectionRef}
        className="bg-blue-900 bg-[url('/document.jpg')] bg-center bg-repeat bg-blend-overlay min-h-screen pt-20 p-16 lg:p-30 "
        style={{ y: parallaxY }}
      >
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
            <motion.h1 variants={itemFadeUp} className="text-5xl font-bold mb-6">Contact Us</motion.h1>
            <motion.p variants={itemFadeUp} className="text-blue-100 text-lg mb-10 leading-relaxed">
              Reach out to us at anytime, we are active 24/7 for any of your enquiry. 
              We give a quick feedback for every enquiry.
            </motion.p>

            <div className="space-y-8">
              {/* Email */}
              <motion.div
                className="flex items-center gap-5"
                {...hoverable}
                variants={itemFadeUp}
                transition={{ duration: 0.2 }}
                style={{ scale: cardScale1, rotate: cardRotate1 }}
              >
                <div className="bg-[#FF7A00] p-3 rounded-lg">
                  <Mail size={24} className="text-white" />
                </div>
                <span className="text-xl">example@taxbridge.com</span>
              </motion.div>

              {/* Address */}
              <motion.div
                className="flex items-start gap-5"
                {...hoverable}
                variants={itemFadeUp}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-[#FF7A00] p-3 rounded-lg mt-1">
                  <MapPin size={24} className="text-white" />
                </div>
                <div className="text-xl">
                  <p>123, Atlanta United State.</p>
                  <p>123, Gwarinpa, Abuja, Nigeria.</p>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                className="flex items-center gap-5"
                {...hoverable}
                variants={cardFloat}
                initial="hidden"
                animate="visible"
                custom={2}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-[#FF7A00] p-3 rounded-lg">
                  <Phone size={24} className="text-white" />
                </div>
                <span className="text-xl">+44 123 654 7890</span>
              </motion.div>
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
              
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-[#03045E] text-white font-bold py-5 rounded-xl hover:bg-black transition-all text-lg uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                {loading ? 'Sending...' : 'Submit'}
              </motion.button>
            </form>
          </motion.div>

        </div>
      </motion.div>

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