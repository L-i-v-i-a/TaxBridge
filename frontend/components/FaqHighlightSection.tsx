import type { ReactNode } from "react";

type FaqItem = {
  question: string;
  answer: ReactNode;
};

type FaqHighlightSectionProps = {
  items: FaqItem[];
};

export default function FaqHighlightSection({ items }: FaqHighlightSectionProps) {
  return (
    <section className="bg-[#0D23AD] text-white">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-16 min-[1600px]:px-0 min-[1600px]:py-[88px]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] min-[1600px]:grid-cols-[420px_436px] min-[1600px]:gap-[109px] min-[1600px]:pl-[237px] min-[1600px]:pr-[258px]">
          <div
            className="animate-fade-up rounded-3xl bg-white p-5 text-[#0B0F1F] shadow-lg transition-transform duration-300 hover:-translate-y-1 min-[1600px]:p-[22px]"
            style={{ animationDelay: "80ms" }}
          >
            {items.map((faq, index) => (
              <details
                key={faq.question}
                className="group border-b border-slate-100 py-3 last:border-none"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-[#0B0F1F] min-[1600px]:text-[21px] min-[1600px]:leading-[31.5px]">
                  {faq.question}
                  <span className="text-slate-400 transition group-open:rotate-180">&darr;</span>
                </summary>
                <p className="mt-2 text-xs text-slate-500 min-[1600px]:text-[17px] min-[1600px]:leading-[25.5px]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
            <h3 className="text-xl font-semibold min-[1600px]:text-[48px] min-[1600px]:leading-[72px]">
              TaxBridge Makes
              <br />
              Tax Filing Effortless
            </h3>
            <p className="mt-3 text-sm text-white/80 min-[1600px]:mt-[16px] min-[1600px]:text-[19px] min-[1600px]:leading-[27px]">
              Empowering individuals and businesses to take control of their taxes using intelligent
              technology and trusted human guidance.
            </p>
            <div className="mt-6 space-y-4 min-[1600px]:mt-[28px] min-[1600px]:space-y-[22px]">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs min-[1600px]:h-[26px] min-[1600px]:w-[26px]">
                  &#10003;
                </span>
                <div>
                  <p className="text-sm font-semibold min-[1600px]:text-[21px] min-[1600px]:leading-[31.5px]">
                    24/7 Availability
                  </p>
                  <p className="mt-1 text-xs text-white/70 min-[1600px]:text-[15px] min-[1600px]:leading-[22.5px]">
                    File your taxes at 3 AM or 3 PM - your dashboard, AI assistant, and support team are
                    always available.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs min-[1600px]:h-[26px] min-[1600px]:w-[26px]">
                  &#10003;
                </span>
                <div>
                  <p className="text-sm font-semibold min-[1600px]:text-[21px] min-[1600px]:leading-[31.5px]">
                    AI Chatbot
                  </p>
                  <p className="mt-1 text-xs text-white/70 min-[1600px]:text-[15px] min-[1600px]:leading-[22.5px]">
                    AI Chatbot available on the Dashboard for Users to interact and have direct
                    communications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
