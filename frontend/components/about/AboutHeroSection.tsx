import Image from "next/image";
import Link from "next/link";

export default function AboutHeroSection() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-16 min-[1600px]:px-0 min-[1600px]:py-[96px]">
      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] min-[1600px]:grid-cols-[541px_486px] min-[1600px]:gap-[63px] min-[1600px]:pl-[254px] min-[1600px]:pr-[256px]">
        <div className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "120ms" }}>
          <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-md animate-float-soft transition-transform duration-500 hover:scale-[1.02] min-[1600px]:h-[493px] min-[1600px]:w-[541px]">
            <Image
              src="/about-hero.png"
              alt="TaxBridge team collaborating"
              width={541}
              height={493}
              className="h-full w-full rounded-3xl object-cover"
            />
          </div>
        </div>
        <div className="order-1 lg:order-2 animate-fade-up" style={{ animationDelay: "60ms" }}>
          <h1 className="text-2xl font-semibold text-[#0D23AD] sm:text-3xl min-[1600px]:text-[48px] min-[1600px]:leading-[68px]">
            About Us
          </h1>
          <p className="mt-3 text-sm text-slate-600 min-[1600px]:mt-[18px] min-[1600px]:text-[20px] min-[1600px]:leading-[28.5px]">
            TaxBridge was founded to solve one of the most frustrating challenges in personal and business
            finance - tax filing. We believe filing taxes should not be a maze of forms, guesswork, and
            stress. Our goal is simple: make taxes easy, transparent, and accessible to everyone.
          </p>
          <p className="mt-4 text-sm text-slate-600 min-[1600px]:mt-[20px] min-[1600px]:text-[20px] min-[1600px]:leading-[28.5px]">
            Our hybrid approach merges AI-driven automation with human expertise to deliver unmatched
            accuracy and efficiency.
          </p>
          <Link
            className="mt-6 inline-flex rounded-md bg-[#0D23AD] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0C1F74] min-[1600px]:mt-[28px] min-[1600px]:px-[18px] min-[1600px]:py-[6px] min-[1600px]:text-[17px]"
            href="/signup"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
