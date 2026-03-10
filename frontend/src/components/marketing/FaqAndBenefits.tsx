const faqItems = [
  {
    question: "How to setup my Taxbridge Account?",
    answer:
      "The process comes easy with direct expression steps, whereby you start by signing up, after sign up, you confirm your email and login.",
  },
  { question: "How Can I file my tax?" },
  { question: "How do I use the AI-tools?" },
  { question: "How can I use the Chatbot?" },
];

export default function FaqAndBenefits() {
  return (
    <section className="bg-[#0c1f74] py-16 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl bg-white p-6 text-[#0f172a] shadow-lg">
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="group rounded-xl border border-[#e8ebf6] px-4 py-3"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                  {item.question}
                  <span className="text-[#102b9a]">
                    {index === 0 ? "-" : ">"}
                  </span>
                </summary>
                {item.answer ? (
                  <p className="mt-2 text-xs text-[#6b7280] leading-relaxed">
                    {item.answer}
                  </p>
                ) : null}
              </details>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-semibold">TaxBridge Makes Tax Filing Effortless</h3>
          <p className="mt-3 text-sm text-white/80 leading-relaxed">
            Empowering individuals and businesses to take control of their taxes using intelligent technology and trusted human guidance.
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">?</span>
              <div>
                <p className="font-semibold">24/7 Availability</p>
                <p className="text-white/70 text-xs">
                  File your taxes at 3 AM or 3 PM — your dashboard, AI assistant, and support team are always available.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">?</span>
              <div>
                <p className="font-semibold">AI Chatbot</p>
                <p className="text-white/70 text-xs">
                  AI Chatbot available on the Dashboard for Users to interact and have direct communications.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

