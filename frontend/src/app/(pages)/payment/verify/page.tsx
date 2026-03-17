'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// 1. The main content component that uses useSearchParams
function PaymentVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  
  const verificationStarted = useRef(false);

  useEffect(() => {
    const reference = searchParams.get('reference');
    
    const verifyPayment = async (ref: string) => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`https://backend-production-c062.up.railway.app/subscriptions/verify?reference=${ref}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Payment successful! Your subscription is now active.');
          setTimeout(() => router.push('/subscription'), 3000);
        } else {
          setStatus('failed');
          setMessage(data.message || 'Payment verification failed.');
        }
      } catch (error) {
        setStatus('failed');
        setMessage('An error occurred during verification.');
        console.error(error);
      }
    };

    if (verificationStarted.current) return;

    if (!reference) {
      // Wrapped in setTimeout to avoid synchronous setState warning
      const timer = setTimeout(() => {
        setStatus('failed');
        setMessage('No payment reference found.');
      }, 0);
      return () => clearTimeout(timer);
    } else {
      verificationStarted.current = true;
      verifyPayment(reference);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        {status === 'loading' && (
          <div className="animate-in fade-in duration-500">
            <Loader2 className="mx-auto animate-spin text-[#0D23AD] mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your transaction.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="animate-in zoom-in duration-300">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-600 mt-2 mb-6">{message}</p>
            <button 
              onClick={() => router.push('/subscription')}
              className="w-full py-3 bg-[#0D23AD] text-white rounded-lg font-medium hover:bg-[#0a1b8a] transition"
            >
              Go to Subscription
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <XCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-800">Verification Failed</h2>
            <p className="text-gray-600 mt-2 mb-6">{message}</p>
            <button 
              onClick={() => router.push('/subscription')}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. The default export wraps the content in Suspense
export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <Loader2 className="mx-auto animate-spin text-[#0D23AD] mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
        </div>
      </div>
    }>
      <PaymentVerifyContent />
    </Suspense>
  );
}