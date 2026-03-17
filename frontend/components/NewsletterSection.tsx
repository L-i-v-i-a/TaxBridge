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
      const response = await fetch('https://backend-production-c062.up.railway.app/contact/subscribe', {
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
        <div className="mx-auto w-full max-w-[1600px] px-6 py-12 min-[1600px]:px-0 min-[1600px]:py-[76px]">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-start min-[1600px]:pl-[253px] min-[1600px]:pr-[253px]">
            <h3
              className="text-lg font-semibold text-[#0B0F1F] animate-fade-up min-[1600px]:text-[32px] min-[1600px]:leading-[45.5px]"
              style={{ animationDelay: "60ms" }}
            >
              Subscribe to our newsletter to get latest news on your inbox.
            </h3>
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md flex-nowrap items-center gap-3 rounded-full bg-[#F1F3F9] p-2 animate-fade-up min-[1600px]:max-w-[420px]"
              style={{ animationDelay: "120ms" }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-600 outline-none min-[1600px]:text-[15px]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-[#0D23AD] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0C1F74] disabled:cursor-not-allowed disabled:opacity-50 min-[1600px]:px-[20px] min-[1600px]:py-[8px] min-[1600px]:text-[17px]"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
                {!loading && <span aria-hidden>&rarr;</span>}
              </button>
            </form>
          </div>
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
