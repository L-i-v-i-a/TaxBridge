import Image from "next/image";
import MarketingNavbar from "@/components/marketing/MarketingNavbar";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import NewsletterSection from "@/components/marketing/NewsletterSection";
import CtaSection from "@/components/marketing/CtaSection";
import FaqAndBenefits from "@/components/marketing/FaqAndBenefits";

const principles = [
  {
    title: "Our Mission",
    description:
      "To empower individuals and businesses to take control of their taxes using intelligent technology and trusted human guidance.",
  },
  {
    title: "Our Vision",
    description:
      "To become the most trusted digital tax partner connecting people, businesses, and authorities through innovation and transparency.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f5f6fb] text-[#0f172a]">
      <MarketingNavbar />

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-[1.1fr_1fr]">
          <Image
            src="/about-hero.png"
            alt="About TaxBridge"
            width={541}
            height={493}
            className="h-auto w-full rounded-2xl shadow-xl"
          />
          <div>
            <h2 className="text-2xl font-semibold text-[#102b9a]">About Us</h2>
            <p className="mt-3 text-sm text-[#475569] leading-relaxed">
              TaxBridge was founded to solve one of the most frustrating challenges in personal and business finance — tax filing.
              We believe filing taxes shouldn&apos;t be a maze of forms, guesswork, and stress. Our goal is simple: make taxes easy,
              transparent, and accessible to everyone.
            </p>
            <p className="mt-3 text-sm text-[#475569] leading-relaxed">
              Our hybrid approach merges AI-driven automation with human expertise to deliver unmatched accuracy and efficiency.
            </p>
            <button className="mt-5 rounded-md bg-[#102b9a] px-4 py-2 text-sm font-semibold text-white">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="text-xl font-semibold text-[#102b9a]">
              We Make Complex Tax
              <br />
              Processes Easy For
              <br />
              Everyone.
            </h3>
            <p className="mt-3 text-sm text-[#6b7280]">We Safeguard Every Byte Of Your Financial Data.</p>
            <div className="mt-6 space-y-5">
              {principles.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2ff] text-[#102b9a]">
                    ?
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <p className="mt-1 text-xs text-[#6b7280] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Image
            src="/about-team.png"
            alt="Team collaboration"
            width={616}
            height={585}
            className="h-auto w-full rounded-2xl shadow-xl"
          />
        </div>
      </section>

      <FaqAndBenefits />
      <NewsletterSection />
      <CtaSection />
      <MarketingFooter />
    </div>
  );
}

