import Image from "next/image";
import Link from "next/link";

export default function AboutHeroSection() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-12 animate-fade-up">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="order-2 flex justify-center animate-slide-in-right lg:order-1" style={{ animationDelay: "100ms" }}>
          <div className="w-full max-w-[420px] overflow-hidden rounded-3xl bg-white p-3 shadow-md">
            <Image
              src="/about-hero.png"
              alt="TaxBridge team collaborating"
              width={420}
              height={380}
              className="h-auto w-full rounded-3xl object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div className="order-1 mx-auto max-w-xl animate-slide-in-left lg:order-2 lg:mx-0">
          <h1 className="text-3xl font-semibold text-[#0D23AD] sm:text-4xl">
            About Us
          </h1>

          <p className="mt-4 text-lg font-bold text-slate-800">
            TaxBridge was founded to solve one of the most frustrating
            challenges in personal and business finance - tax filing. We believe
            filing taxes should not be a maze of forms, guesswork, and stress.
            Our goal is simple: make taxes easy, transparent, and accessible to
            everyone.
          </p>

          <p className="mt-4 text-lg text-slate-600">
            Our hybrid approach merges AI-driven automation with human expertise
            to deliver unmatched accuracy and efficiency.
          </p>

          <Link
            className="mt-6 inline-flex rounded-md bg-[#0D23AD] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0C1F74]"
            href="/signup"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
