import Image from "next/image";

const steps = [
  {
    title: "Create Your Account",
    description:
      "Set up your secure TaxBridge account and choose your filing type (individual or business).",
  },
  {
    title: "Upload or Sync Your Tax Documents",
    description:
      "Easily upload your tax forms (W-2, 1099, receipts, or invoices).",
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
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#0B0F1F] sm:text-3xl">
          4 Easy steps to Get started
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Get to know the basic step by step to Get Started and start filing with ease, easy step.
        </p>
      </div>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl bg-[#EDF2FF] p-3">
            <Image
              src="/feature-steps.png"
              alt="TaxBridge steps preview"
              width={620}
              height={520}
              className="h-auto w-full rounded-3xl object-cover"
            />
          </div>
          <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-xl bg-[#1A2CA4] px-4 py-3 text-white shadow-lg">
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
              <p className="text-white/70">Quick Notification of your Tax Filed</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D23AD] text-xs font-semibold text-white">
                {index + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#0B0F1F]">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
