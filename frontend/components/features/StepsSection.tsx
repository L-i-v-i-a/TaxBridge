import Image from "next/image";

const steps = [
  {
    title: "Create Your Account",
    description:
      "Set up your secure TaxBridge account and choose your filing type (individual, freelancer, or business).",
  },
  {
    title: "Upload or Sync Your Tax Documents",
    description: "Easily upload your tax forms (W-2, 1099, receipts, or invoices).",
  },
  {
    title: "Review with AI + Expert Precision",
    description:
      "Our intelligent system scans for missing data, unclaimed deductions, or possible errors.",
  },
  {
    title: "File, Track, and Relax",
    description:
      "You will receive instant confirmation and real-time updates on your filing status.",
  },
];

export default function StepsSection() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-16 min-[1600px]:px-0 min-[1600px]:py-[96px]">
      <div className="text-center animate-fade-up" style={{ animationDelay: "60ms" }}>
        <h2 className="text-2xl font-semibold text-[#0B0F1F] sm:text-3xl min-[1600px]:text-[40px] min-[1600px]:leading-[60px]">
          4 Easy steps to Get started
        </h2>
        <p className="mt-2 text-sm text-slate-500 min-[1600px]:text-[20px] min-[1600px]:leading-[28.5px]">
          Get to know the basic step by step to Get Started and start filing with ease, easy step.
        </p>
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] min-[1600px]:mt-[64px] min-[1600px]:grid-cols-[493px_373px] min-[1600px]:gap-[107px] min-[1600px]:pl-[310px] min-[1600px]:pr-[317px]">
        <div className="relative animate-fade-in" style={{ animationDelay: "120ms" }}>
          <div className="overflow-hidden rounded-3xl bg-[#EDF2FF] p-3 animate-float-soft transition-transform duration-500 hover:scale-[1.02] min-[1600px]:h-[620px] min-[1600px]:w-[493px]">
            <Image
              src="/feature-steps.png"
              alt="TaxBridge steps preview"
              width={493}
              height={620}
              className="h-full w-full rounded-3xl object-cover"
            />
          </div>
          <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-xl bg-[#1A2CA4] px-4 py-3 text-white shadow-lg min-[1600px]:bottom-[42px] min-[1600px]:left-[-96px] min-[1600px]:h-[196px] min-[1600px]:w-[459px] min-[1600px]:px-[22px] min-[1600px]:py-[20px]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7 12.5L10.2 15.5L17 8.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="text-xs">
              <p className="font-semibold">Tax Filed</p>
              <p className="text-white/70">Quick Notification of Your Tax Filed</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 min-[1600px]:space-y-[36px]">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex gap-4 animate-fade-up"
              style={{ animationDelay: `${180 + index * 120}ms` }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D23AD] text-xs font-semibold text-white min-[1600px]:h-[26px] min-[1600px]:w-[26px] min-[1600px]:text-[17px] min-[1600px]:leading-[25.5px]">
                {index + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#0B0F1F] min-[1600px]:text-[21px] min-[1600px]:leading-[31.5px]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 min-[1600px]:text-[17px] min-[1600px]:leading-[25.5px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
