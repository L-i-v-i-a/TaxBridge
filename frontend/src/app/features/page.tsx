import Image from "next/image";
import MarketingNavbar from "@/app/components/marketing/MarketingNavbar";
import MarketingFooter from "@/app/components/marketing/MarketingFooter";
import NewsletterSection from "@/app/components/marketing/NewsletterSection";
import CtaSection from "@/app/components/marketing/CtaSection";
import FaqAndBenefits from "@/app/components/marketing/FaqAndBenefits";

const features = [
  {
    title: "AI-Powered Tax Analyzer",
    description:
      "Instantly detects missed deductions or inconsistencies. Suggests optimization tips in real time.",
    icon: "?",
  },
  {
    title: "Personalized Dashboard",
    description:
      "See your income summary, filing status, refund estimate, and pending tasks in one glance.",
    icon: "?",
  },
  {
    title: "Human Expert Chat",
    description:
      "Real-time chat or video consultation with certified tax experts. Multilingual support.",
    icon: "?",
  },
];

const steps = [
  {
    title: "Create Your Account",
    description:
      "Set up your secure TaxBridge account and choose your filing type (Individuals, business).",
  },
  {
    title: "Upload or Sync Your Tax Document",
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
      "You'll receive instant confirmation and real-time updates on your filing status.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-[#f5f6fb] text-[#0f172a]">
      <MarketingNavbar />

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6 text-center">
          <p className="text-lg font-semibold text-[#111827]">Our Key Features</p>
          <p className="mt-2 text-sm text-[#6b7280]">
            Get to know some of our Features at Taxbridge which provide the best service for our Users.
          </p>
        </div>
        <div className="mx-auto mt-10 flex w-full max-w-6xl items-center justify-end px-6">
          <div className="flex items-center gap-2 text-[#6b7280]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb]">?</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb]">?</span>
          </div>
        </div>
        <div className="mx-auto mt-6 grid w-full max-w-6xl gap-6 px-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2ff] text-[#102b9a]">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-xs text-[#6b7280] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1b37b6] via-[#132c98] to-[#0c1f74] py-16 text-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl bg-white/10 p-2">
            <Image
              src="/feature-automation.svg"
              alt="AI automation"
              width={640}
              height={420}
              className="h-auto w-full rounded-2xl"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold leading-snug">
              AI-driven automation
              <br />
              with human expertise
              <br />
              to deliver unmatched
              <br />
              accuracy and
              <br />
              efficiency.
            </h2>
            <p className="mt-4 text-sm text-white/80 leading-relaxed">
              Our goal is simple: make taxes easy, transparent, and accessible to everyone.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#102b9a]">
              Signup Now <span>?</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6 text-center">
          <h3 className="text-xl font-semibold text-[#111827]">4 Easy steps to Get started</h3>
          <p className="mt-2 text-sm text-[#6b7280]">
            Get to know the basic step by step to Get Started and start filing with ease, easy step.
          </p>
        </div>
        <div className="mx-auto mt-10 grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-[1fr_1.1fr]">
          <div className="relative">
            <Image
              src="/feature-steps.svg"
              alt="Steps preview"
              width={520}
              height={420}
              className="h-auto w-full rounded-2xl"
            />
            <div className="absolute bottom-6 left-6 rounded-xl bg-[#0f172a] px-4 py-3 text-xs text-white shadow-lg">
              <p className="font-semibold">Tax Filed</p>
              <p className="text-white/70">Quick Notification of your Tax Filed</p>
            </div>
          </div>
          <div className="space-y-5">
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#102b9a] text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-sm font-semibold">{step.title}</h4>
                  <p className="mt-1 text-xs text-[#6b7280] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqAndBenefits />
      <NewsletterSection />
      <CtaSection />
      <MarketingFooter />
    </div>
  );
}

