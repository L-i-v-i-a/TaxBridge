'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Set a timer to navigate after 3 seconds
    const timer = setTimeout(() => {
      router.push('/home');
    }, 3000);

    // Cleanup the timer if the component unmounts early
    return () => clearTimeout(timer);
  }, [router]);


export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D23AD]">
      <div className="text-center">
        <h1 className="animate-fade-in-out text-4xl font-bold text-white">
         TAXBRIDGE<br/>
         US Tax Calculation Software
        </h1>
      </div>

    
    </main>
  );
}