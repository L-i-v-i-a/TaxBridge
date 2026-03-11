import Image from "next/image";
import Link from "next/link";

export default function FeatureHighlightSection() {
  return (
    <section className="relative overflow-hidden bg-[#0D23AD] text-white">
      <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center opacity-10" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_1fr]">
        <div className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl bg-white/10 p-2">
            <Image
              src="/feature-automation.png"
              alt="Team working on tax documents"
              width={620}
              height={420}
              className="h-auto w-full rounded-3xl object-cover"
            />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">
            AI-driven automation with human expertise to deliver unmatched accuracy and efficiency.
          </h2>
          <p className="mt-4 text-sm text-white/80">
            Our goal is simple: make taxes easy, transparent, and accessible to everyone.
          </p>
          <Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#5FF7E2]" href="/signup">
            Signup Now
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
