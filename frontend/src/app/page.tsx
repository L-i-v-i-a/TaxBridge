'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    if (phase === 'typing') {
      const fullText = 'TAXBRIDGE';
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
        if (i === fullText.length) {
          clearInterval(interval);
          setTimeout(() => setPhase('fadeout'), 500);
        }
      }, 100);
    } else if (phase === 'fadeout') {
      setTimeout(() => setPhase('full'), 200);
    }
  }, [phase]);

  useEffect(() => {
    // Set a timer to navigate after 3 seconds
    const timer = setTimeout(() => {
      router.push('/home');
    }, 3000);

    // Cleanup the timer if the component unmounts early
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      className="flex min-h-screen  items-center justify-center"
      style={{
        backgroundImage: "linear-gradient(rgba(13, 35, 173, 0.7), rgba(13, 35, 173, 0.7)), url('/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-center">
        <h1 className={`text-6xl font-bold text-white transition-opacity duration-200 ${phase === 'fadeout' ? 'opacity-0' : 'opacity-100'}`}>
          {phase === 'full' ? (
            <>
              TAXBRIDGE
              <br />
              US Tax Calculation Software
            </>
          ) : (
            displayedText
          )}
        </h1>
      </div>
    </main>
  );
}
