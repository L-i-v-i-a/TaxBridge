"use client";

import { useState } from "react";

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

  return (
    <section className="bg-white py-16">
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
              (billing === "yearly" ? "bg-[var(--brand)]" : "bg-[var(--brand)]/30")
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
          <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-white">
            Save 35%
          </span>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                "relative flex flex-col overflow-hidden rounded-3xl border bg-white p-8 shadow-sm " +
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
                  <li key={feature} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
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
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  className={
                    "inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition " +
                    (plan.featured
                      ? "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
                      : "bg-slate-900 text-white hover:bg-slate-800")
                  }
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

      <div className="mt-20 bg-[var(--brand)] py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
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

            <div className="relative overflow-hidden rounded-3xl bg-[var(--brand)] p-10 text-white shadow-sm">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <h3 className="text-2xl font-semibold">TaxBridge Makes Tax Filing Effortless</h3>
              <p className="mt-4 max-w-md text-sm text-white/80">
                Empowering individuals and businesses to take control of their taxes using intelligent technology and trusted human guidance.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 5V19"
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
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 4H20V20H4V4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 12H16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11 16H13"
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

              <div className="mt-10 rounded-2xl bg-white/10 p-6">
                <p className="text-sm font-semibold text-white">Subscribe to our newsletter</p>
                <p className="mt-1 text-sm text-white/80">Get latest news on your inbox.</p>
                <form className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[var(--brand)] shadow-sm transition hover:bg-white/90"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
