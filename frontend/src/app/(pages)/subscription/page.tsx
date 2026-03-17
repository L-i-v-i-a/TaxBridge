// app/subscription/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, Loader2, CreditCard, XCircle, Calendar, RefreshCw, 
  AlertCircle, Crown, Sparkles 
} from 'lucide-react';
import Topbar from '../../../../components/dashboard/Topbar';
import Sidebar from '../../../../components/dashboard/Sidebar';

interface Plan {
  id: string;
  title: string;
  price: number;
  discount?: number;
  features: string[];
  type: 'monthly' | 'yearly';
}

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  nextPaymentDate: string | null;
  plan: {
    id: string;
    title: string;
    price: number;
    type: string;
  };
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingSub, setLoadingSub] = useState(true);
  const [processingAction, setProcessingAction] = useState<string | null>(null); // 'subscribe', 'change', 'cancel', 'update'

  // Fetch Plans
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const res = await fetch(`https://backend-production-c062.up.railway.app/pricing/${billingCycle}`);
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
        }
      } catch (error) {
        console.error('Failed to fetch plans', error);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, [billingCycle]);

  // Fetch Current Subscription
  useEffect(() => {
    const fetchSub = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      try {
        const res = await fetch('https://backend-production-c062.up.railway.app/subscriptions/my-subscription', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentSubscription(data);
        } else {
          setCurrentSubscription(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSub(false);
      }
    };
    fetchSub();
  }, []);

  // --- Actions ---

  const handleSubscribe = async (planId: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) return router.push('/login');

    setProcessingAction(`sub-${planId}`);
    try {
      const res = await fetch('https://backend-production-c062.up.railway.app/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleChangePlan = async (newPlanId: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    if (!confirm('Are you sure you want to switch plans? The new rate will apply from your next billing date.')) return;

    setProcessingAction(`change-${newPlanId}`);
    try {
      const res = await fetch('https://backend-production-c062.up.railway.app/subscriptions/change-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: newPlanId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Plan updated successfully! Changes will reflect on your next billing date.');
        // Refresh subscription data
        setCurrentSubscription(data); 
        // Or re-fetch
        // window.location.reload();
      } else {
        alert(data.message || 'Failed to change plan');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleUpdateCard = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setProcessingAction('update');
    try {
      const res = await fetch('https://backend-production-c062.up.railway.app/subscriptions/update-card', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert(data.message || 'Could not generate update link');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleCancel = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    setProcessingAction('cancel');
    try {
      const res = await fetch('https://backend-production-c062.up.railway.app/subscriptions/cancel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        alert('Subscription cancelled successfully.');
        setCurrentSubscription(data); // Update UI
      } else {
        alert(data.message || 'Failed to cancel');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setProcessingAction(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan?.id === planId && currentSubscription?.status === 'active';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 mt-16 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-8">
            
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
              <p className="text-gray-500">Manage your plan, billing, and preferences.</p>
            </div>

            {/* Current Subscription Section */}
            <div className="mb-10">
              {loadingSub ? (
                <div className="bg-white p-6 rounded-xl border shadow-sm h-32 flex items-center justify-center">
                  <Loader2 className="animate-spin text-gray-400" />
                </div>
              ) : currentSubscription ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0D23AD] rounded-full flex items-center justify-center text-white">
                        <Crown size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{currentSubscription.plan.title}</h2>
                        <p className="text-sm text-gray-500 capitalize">{currentSubscription.plan.type} Plan</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      currentSubscription.status === 'active' ? 'bg-green-100 text-green-700' : 
                      currentSubscription.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {currentSubscription.status}
                    </span>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-gray-400" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Started</p>
                        <p className="font-medium text-sm">{new Date(currentSubscription.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RefreshCw className="text-gray-400" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Next Payment</p>
                        <p className="font-medium text-sm">
                          {currentSubscription.nextPaymentDate ? new Date(currentSubscription.nextPaymentDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="text-gray-400" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-medium text-sm">${currentSubscription.plan.price} / {currentSubscription.plan.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 border-t flex flex-wrap gap-3">
                    <button 
                      onClick={handleUpdateCard}
                      disabled={processingAction === 'update'}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                    >
                      {processingAction === 'update' ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CreditCard size={16} className="mr-2" />}
                      Update Card
                    </button>
                    
                    {currentSubscription.status !== 'cancelled' && (
                      <button 
                        onClick={handleCancel}
                        disabled={processingAction === 'cancel'}
                        className="inline-flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                      >
                        {processingAction === 'cancel' ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <XCircle size={16} className="mr-2" />}
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center">
                  <AlertCircle className="mx-auto text-gray-300 mb-3" size={32} />
                  <h3 className="font-medium text-gray-800">No Active Plan</h3>
                  <p className="text-sm text-gray-500">Choose a plan below to get started.</p>
                </div>
              )}
            </div>

            {/* Plan Selection */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Available Plans</h3>
                <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      billingCycle === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      billingCycle === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              {loadingPlans ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#0D23AD]" size={32} /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => {
                    const isActive = isCurrentPlan(plan.id);
                    return (
                      <div 
                        key={plan.id} 
                        className={`rounded-xl border p-6 flex flex-col relative ${
                          isActive ? 'border-[#0D23AD] bg-blue-50/50' : 'border-gray-200'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0 px-2 py-0.5 bg-[#0D23AD] text-white text-xs rounded-full shadow">
                            Active
                          </div>
                        )}
                        
                        <h4 className="text-xl font-semibold text-gray-900">{plan.title}</h4>
                        <div className="mt-3 mb-4">
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-gray-500">/ {billingCycle}</span>
                        </div>

                        <ul className="space-y-2 mb-6 flex-1">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-600">
                              <Check className="text-green-500 mr-2 mt-0.5 shrink-0" size={14} /> {f}
                            </li>
                          ))}
                        </ul>

                        {isActive ? (
                          <button disabled className="w-full py-2.5 bg-gray-100 text-gray-500 font-medium rounded-lg text-sm cursor-not-allowed">
                            Current Plan
                          </button>
                        ) : currentSubscription ? (
                          // Change Plan Button
                          <button
                            onClick={() => handleChangePlan(plan.id)}
                            disabled={processingAction === `change-${plan.id}`}
                            className="w-full py-2.5 border border-[#0D23AD] text-[#0D23AD] font-medium rounded-lg text-sm hover:bg-blue-50 transition disabled:opacity-50 flex justify-center items-center"
                          >
                            {processingAction === `change-${plan.id}` ? <Loader2 className="animate-spin h-4 w-4" /> : 'Switch Plan'}
                          </button>
                        ) : (
                          // Subscribe Button
                          <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={processingAction === `sub-${plan.id}`}
                            className="w-full py-2.5 bg-[#0D23AD] text-white font-medium rounded-lg text-sm hover:bg-[#0a1b8a] transition disabled:opacity-50 flex justify-center items-center"
                          >
                            {processingAction === `sub-${plan.id}` ? <Loader2 className="animate-spin h-4 w-4" /> : 'Get Started'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}