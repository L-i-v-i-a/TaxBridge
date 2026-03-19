import Image from "next/image";
import Link from "next/link";

export default function FeatureHighlightSection() {
  return (
    <section className="relative overflow-hidden bg-[#0D23AD] text-white">
      <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center opacity-10" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-2">
          {/* Image */}
          <div className="order-2 flex justify-center animate-slide-in-right lg:order-1" style={{ animationDelay: "100ms" }}>
            <div className="w-full max-w-[507px] overflow-hidden rounded-3xl bg-white/10 p-2 transition-transform duration-500 hover:scale-[0.98]">
              <Image
                src="/feature-automation.png"
                alt="Team working on tax documents"
                width={507}
                height={463}
                className="h-auto w-full rounded-3xl object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 mx-auto max-w-xl animate-slide-in-left lg:order-2 lg:mx-0">
            <h2 className="text-4xl font-bold leading-snug tracking-tight sm:text-5xl">
              AI-driven automation with human expertise to deliver unmatched
              accuracy and efficiency.
            </h2>

            <p className="mt-5 text-lg font-semibold text-white/80">
              Our goal is simple: make taxes easy, transparent, and accessible
              to everyone.
            </p>

            <Link
              className="mt-6 inline-flex items-center gap-2 border-b border-[#5FF7E2] pb-1 text-sm font-bold text-[#5FF7E2] transition hover:opacity-80"
              href="/signup"
            >
              Signup Now
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
