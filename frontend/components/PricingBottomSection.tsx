"use client";

import { useEffect, useRef, useState } from "react";

type Faq = { question: string; answer: string };

export default function PricingBottomSection({ faqs }: { faqs: Faq[] }) {
  const [expanded, setExpanded] = useState(0);
  const [inView, setInView] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === bottomRef.current) {
            setInView(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={bottomRef}
      className={
        "mt-20 bg-[#0D23AD] py-20 transition-all duration-700 ease-out " +
        (inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")
      }
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className=" bg-white p-8 shadow-xl transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">How to setup my TaxBridge Account?</h3>
            <div className="mt-6 divide-y divide-slate-200">
              {faqs.map((faq, index) => {
                const isOpen = expanded === index;
                return (
                  <div key={faq.question} className="py-4">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span className="text-sm font-medium text-slate-900">{faq.question}</span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-sm">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d={isOpen ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="mt-3 text-sm leading-relaxed text-slate-700">
                        {faq.answer}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-[#0D23AD] p-10 text-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <h3 className="text-2xl font-semibold">TaxBridge Makes Tax Filing Effortless</h3>
              <p className="mt-4 max-w-md text-sm text-white/80">
                Empowering individuals and businesses to take control of their taxes using intelligent technology and trusted human guidance.
              </p>
            </div>

            <div className="mt-8 flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 items-center justify-center ">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M8 12l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold">24/7 Availability</p>
                  <p className="mt-1 text-sm text-white/80">
                    Access your taxes anytime — your dashboard, all the documentation, and expert answers are always available.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M8 12l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold">AI Chatbot</p>
                  <p className="mt-1 text-sm text-white/80">
                    An AI assistant is available on the dashboard to answer questions and guide communications.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
