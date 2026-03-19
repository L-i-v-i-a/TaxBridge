import Image from "next/image";

const highlights = [
  {
    title: "Our Mission",
    description:
      "To empower individuals and businesses to take control of their taxes using intelligent technology and trusted human guidance.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="7" stroke="#0D23AD" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="#0D23AD" />
        <path
          d="M20 4L15.5 8.5"
          stroke="#0D23AD"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Our Vision",
    description:
      "To become the most trusted digital tax partner connecting people, businesses, and authorities through innovation and transparency.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M2 12C4.4 7.5 8 5 12 5C16 5 19.6 7.5 22 12C19.6 16.5 16 19 12 19C8 19 4.4 16.5 2 12Z"
          stroke="#0D23AD"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="#0D23AD"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
];

export default function MissionVisionSection() {
  return (
    <section className="mx-auto w-full max-w-5xl bg-white px-6 py-16 lg:px-12 animate-fade-up">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Text Section */}
        <div className="mx-auto max-w-xl animate-slide-in-left lg:mx-0">
          <h2 className="text-3xl font-bold text-[#0D23AD] sm:text-4xl">
            We Make Complex Tax Processes Easy For Everyone.
          </h2>

          <p className="mt-3 text-lg font-bold text-slate-800">
            We Safeguard Every Byte Of Your Financial Data.
          </p>

          <div className="mt-6 space-y-6">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="-mt-[4px] flex h-8 w-8 items-center justify-center rounded-full bg-[#E9F1FF]">
                  {item.icon}
                </span>

                <div>
                  <p className="text-lg font-bold text-[#0D23AD]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-700">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center animate-slide-in-right" style={{ animationDelay: "100ms" }}>
          <Image
            src="/about-team.png"
            alt="TaxBridge team meeting"
            width={420}
            height={380}
            className="h-auto w-full max-w-[420px] rounded-3xl object-cover shadow-md transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
}
