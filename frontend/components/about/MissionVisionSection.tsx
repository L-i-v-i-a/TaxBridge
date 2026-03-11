import Image from "next/image";

export default function MissionVisionSection() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-16 min-[1600px]:px-0 min-[1600px]:py-[96px]">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] min-[1600px]:grid-cols-[551px_616px] min-[1600px]:gap-[104px] min-[1600px]:pl-[269px] min-[1600px]:pr-[260px]">
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <h2 className="text-2xl font-semibold text-[#0D23AD] sm:text-3xl min-[1600px]:text-[40px] min-[1600px]:leading-[60px]">
            We Make Complex Tax Processes Easy For Everyone.
          </h2>
          <p className="mt-3 text-sm text-slate-500 min-[1600px]:mt-[8px] min-[1600px]:text-[20px] min-[1600px]:leading-[28.5px]">
            We Safeguard Every Byte Of Your Financial Data.
          </p>
          <div className="mt-6 space-y-6 min-[1600px]:mt-[36px] min-[1600px]:space-y-[28px]">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#E9F1FF]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L14 8H10L12 4Z" fill="#0D23AD" />
                  <circle cx="12" cy="14" r="4" fill="#0D23AD" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0B0F1F] min-[1600px]:text-[21px] min-[1600px]:leading-[30px]">
                  Our Mission
                </p>
                <p className="mt-2 text-xs text-slate-500 min-[1600px]:text-[18px] min-[1600px]:leading-[25.5px]">
                  To empower individuals and businesses to take control of their taxes using intelligent
                  technology and trusted human guidance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#E9F1FF]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M12 5V19" stroke="#0D23AD" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0B0F1F] min-[1600px]:text-[21px] min-[1600px]:leading-[30px]">
                  Our Vision
                </p>
                <p className="mt-2 text-xs text-slate-500 min-[1600px]:text-[18px] min-[1600px]:leading-[25.5px]">
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
            width={616}
            height={585}
            className="h-auto w-full rounded-3xl object-cover shadow-md transition-transform duration-500 hover:scale-[1.02] min-[1600px]:h-[585px] min-[1600px]:w-[616px]"
          />
        </div>
      </div>
    </section>
  );
}
