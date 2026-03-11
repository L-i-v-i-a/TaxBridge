import Image from "next/image";

export default function MissionVisionSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <h2 className="text-2xl font-semibold text-[#0D23AD] sm:text-3xl">
            We Make Complex Tax Processes Easy For Everyone.
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            We Safeguard Every Byte Of Your Financial Data.
          </p>
          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#E9F1FF]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L14 8H10L12 4Z" fill="#0D23AD" />
                  <circle cx="12" cy="14" r="4" fill="#0D23AD" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0B0F1F]">Our Mission</p>
                <p className="mt-2 text-xs text-slate-500">
                  To empower individuals and businesses to take control of their taxes using intelligent
                  technology and trusted human guidance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#E9F1FF]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 12H19M12 5V19"
                    stroke="#0D23AD"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0B0F1F]">Our Vision</p>
                <p className="mt-2 text-xs text-slate-500">
                  To become the most trusted digital tax partner connecting people, businesses, and
                  authorities through innovation and transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "140ms" }}>
          <Image
            src="/about-team.png"
            alt="TaxBridge team meeting"
            width={620}
            height={520}
            className="h-auto w-full rounded-3xl object-cover shadow-md transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
}
