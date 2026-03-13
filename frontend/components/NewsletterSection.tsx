'use client';
import React, { useState } from 'react';
import NotificationModal from '../components/NotificationModal'; // Adjust path as needed

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal State
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showModal("Please enter a valid email address.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/contact/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showModal("Successfully subscribed! Check your inbox.", "success");
        setEmail(''); // Clear input on success
      } else {
        const data = await response.json();
        // Handle case where user is already subscribed
        showModal(data.message || "Subscription failed.", "error");
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
      <section className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 lg:flex-row lg:items-center">
          <h3 className="text-lg font-semibold text-[#0B0F1F]">
            Subscribe to our newsletter to get latest news on your inbox.
          </h3>
          
          <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-3 rounded-full bg-[#F1F3F9] p-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent px-3 text-sm text-slate-600 outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-[#0D23AD] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
              {!loading && <span aria-hidden>→</span>}
            </button>
          </form>
        </div>
      </section>

      {/* Notification Modal */}
      <NotificationModal 
        isOpen={modalState.isOpen}
        message={modalState.message}
        type={modalState.type}
        onClose={closeModal}
      />
    </>
  );
}