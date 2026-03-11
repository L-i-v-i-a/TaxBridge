type FaqItem = {
  question: string;
  answer: string;
};

type FaqHighlightSectionProps = {
  items: FaqItem[];
};

export default function FaqHighlightSection({ items }: FaqHighlightSectionProps) {
  return (
    <section className="bg-[#0D23AD] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_1fr]">
        <div
          className="animate-fade-up rounded-3xl bg-white p-6 text-[#0B0F1F] shadow-lg transition-transform duration-300 hover:-translate-y-1"
          style={{ animationDelay: "80ms" }}
        >
          {items.map((faq, index) => (
            <details
              key={faq.question}
              className="group border-b border-slate-100 py-4 last:border-none"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-[#0B0F1F]">
                {faq.question}
                <span className="text-slate-400 transition group-open:rotate-180">&darr;</span>
              </summary>
              <p className="mt-3 text-xs text-slate-500">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
          <h3 className="text-xl font-semibold">TaxBridge Makes Tax Filing Effortless</h3>
          <p className="mt-3 text-sm text-white/80">
            Empowering individuals and businesses to take control of their taxes using intelligent
            technology and trusted human guidance.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs">
                &#10003;
              </span>
              <div>
                <p className="text-sm font-semibold">24/7 Availability</p>
                <p className="mt-1 text-xs text-white/70">
                  File your taxes at 3 AM or 3 PM - your dashboard, AI assistant, and support team are
                  always available.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs">
                &#10003;
              </span>
              <div>
                <p className="text-sm font-semibold">AI Chatbot</p>
                <p className="mt-1 text-xs text-white/70">
                  AI Chatbot available on the Dashboard for Users to interact and have direct
                  communications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
