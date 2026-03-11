import Image from "next/image";
import Link from "next/link";

export default function AboutHeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-md">
            <Image
              src="/about-hero.png"
              alt="TaxBridge team collaborating"
              width={620}
              height={480}
              className="h-auto w-full rounded-3xl object-cover"
            />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <h1 className="text-2xl font-semibold text-[#0D23AD] sm:text-3xl">About Us</h1>
          <p className="mt-3 text-sm text-slate-600">
            TaxBridge was founded to solve one of the most frustrating challenges in personal and business
            finance - tax filing. We believe filing taxes should not be a maze of forms, guesswork, and
            stress. Our goal is simple: make taxes easy, transparent, and accessible to everyone.
          </p>
          <p className="mt-4 text-sm text-slate-600">
            Our hybrid approach merges AI-driven automation with human expertise to deliver unmatched
            accuracy and efficiency.
          </p>
          <Link
            className="mt-6 inline-flex rounded-md bg-[#0D23AD] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0C1F74]"
            href="/signup"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
