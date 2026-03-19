import Image from "next/image";

const steps = [
  {
    title: "Create Your Account",
    description:
      "Set up your secure TaxBridge account and choose your filing type (individual, freelancer, or business).",
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
    <section className="mx-auto w-full max-w-4xl px-6 lg:px-12 py-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0B0F1F] sm:text-4xl">
          4 Easy steps to Get started
        </h2>
        <p className="mt-3 text-slate-700 font-semibold">
          Get to know the basic step by step to get started and start filing
          with ease.
        </p>
      </div>

      {/* Content */}
      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="flex justify-center animate-slide-in-left">
          <div className="w-full max-w-[542px] overflow-hidden rounded-3xl bg-[#EDF2FF] p-3 transition-transform duration-500 hover:scale-[0.98]">
            <Image
              src="/feature-steps.png"
              alt="TaxBridge steps preview"
              width={542}
              height={583}
              className="w-full h-auto rounded-3xl object-cover"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 max-w-xl mx-auto animate-slide-in-right lg:mx-0" style={{ animationDelay: "100ms" }}>
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D23AD] text-xs font-semibold text-white">
                {index + 1}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0B0F1F]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
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
