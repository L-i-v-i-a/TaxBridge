"use client";

import { useEffect, useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    priceMonthly: 19,
    priceYearly: 108,
    description: "Ideal for individuals",
    features: [
      "AI-powered filing assistant",
      "Auto document upload",
      "Real-time refund estimation",
      "Basic error detection",
      "Filing status tracker",
    ],
  },
  {
    name: "Standard",
    priceMonthly: 49,
    priceYearly: 512,
    description: "Best for small teams",
    features: [
      "Includes everything in Starter",
      "Expert human review",
      "Chat support with specialists",
      "Multi-income & business filing",
      "Auto-import from payroll",
      "Detailed filing summary report",
    ],
    featured: true,
  },
  {
    name: "Premium",
    priceMonthly: 99,
    priceYearly: 990,
    description: "For growing businesses",
    features: [
      "Includes everything in Standard",
      "1-on-1 video consultation",
      "Tax audit & compliance support",
      "Multi-year filing",
      "Personalized tax insights",
      "Priority support (phone + chat)",
    ],
  },
];

const faqs = [
  {
    question: "How to setup my TaxBridge Account?",
    answer:
      "Create your account and verify your email. Then follow the onboarding steps to connect your tax documents, so we can prepare your return accurately.",
  },
  {
    question: "How can I file my taxes?",
    answer:
      "Our guided workflow walks you through each section with smart suggestions; once complete, submit directly through the platform.",
  },
  {
    question: "How do I use the AI tools?",
    answer:
      "Use the AI assistant to classify expenses, summarize documents, and generate draft responses to tax questions.",
  },
  {
    question: "How can I use the Chatbot?",
    answer:
      "Ask the Chatbot for real-time help, status updates, and recommendations throughout your filing journey.",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [expanded, setExpanded] = useState(0);
  const [cardsInView, setCardsInView] = useState(false);
  const [bottomInView, setBottomInView] = useState(false);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === cardsRef.current) {
            setCardsInView(entry.isIntersecting);
          }
          if (entry.target === bottomRef.current) {
            setBottomInView(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (cardsRef.current) observer.observe(cardsRef.current);
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white font-sans py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className= "mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Pricing &amp; Plans</p>
          <h2 className="text-sm font-semibold tracking-wide text-slate-500">
            Upgrade your plan and simplify your tax filing with smart automation and guided support.
          </h2>
        </div>
        <div className="mx-auto mt-10 flex items-center justify-center gap-4">
          <span className="text-sm font-semibold text-slate-500">Monthly</span>
          <button
            type="button"
            onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
            className={
              "relative h-8 w-14 rounded-full transition " +
              (billing === "yearly" ? "bg-[#0D23AD]" : "bg-[var(--brand)]/30")
            }
          >
            <span
              className={
                "absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition transform " +
                (billing === "yearly" ? "translate-x-6" : "translate-x-0")
              }
            />
          </button>
          <span className="text-sm font-semibold text-slate-500">Yearly</span>
          <span className="rounded-full bg-[#0D23AD] px-3 py-1 text-xs font-semibold text-white">
            {billing === "monthly" ? "Save 35%" : "Save 25%"}
          </span>
        </div>

        <div
          ref={cardsRef}
          className={
            "mt-12 grid gap-6 lg:grid-cols-3 transition-all duration-700 ease-out " +
            (cardsInView
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-8")
          }
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                "relative flex flex-col overflow-hidden rounded-lg border bg-white p-8 shadow-sm " +
                (plan.featured
                  ? "border-[var(--brand)]/20 ring-1 ring-[var(--brand)]/20"
                  : "border-slate-200")
              }
            >
              <div className="mt-6 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-semibold text-slate-900">
                  ${billing === "monthly" ? plan.priceMonthly : plan.priceYearly}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  /{billing === "monthly" ? "month" : "year"}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-400">
                billed {billing}
              </p>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="group flex gap-3 cursor-pointer rounded-lg px-2 py-1 transition-colors duration-200 ease-out hover:bg-slate-50"
                  >
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 12.5L11.5 15L16 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                    <span className="transition-transform duration-200 ease-out group-hover:translate-x-2">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white bg-[#0D23AD] transition hover:bg-[var(--brand)]/90"
                >
                  Start Free Trial
                </button>

                <p className="text-center text-xs text-slate-400">
                  No credit card required
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={bottomRef}
        className={
          "mt-20 bg-[#0D23AD] py-20 transition-all duration-700 ease-out " +
          (bottomInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")
        }
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-8 shadow-xl transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl">
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
    </section>
  );
}
