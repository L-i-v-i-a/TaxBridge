import Image from "next/image";
import Link from "next/link";

export default function FeatureHighlightSection() {
  return (
    <section className="relative overflow-hidden bg-[#0D23AD] text-white">
      <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center opacity-10" />
      <div className="relative mx-auto w-full max-w-[1600px] px-6 py-16 min-[1600px]:px-0 min-[1600px]:py-[92px]">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] min-[1600px]:grid-cols-[557px_649px] min-[1600px]:gap-[47px] min-[1600px]:pl-[217px] min-[1600px]:pr-[130px]">
          <div className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "120ms" }}>
            <div className="overflow-hidden rounded-3xl bg-white/10 p-2 animate-float-soft transition-transform duration-500 hover:scale-[1.02] min-[1600px]:h-[513px] min-[1600px]:w-[557px]">
              <Image
                src="/feature-automation.png"
                alt="Team working on tax documents"
                width={557}
                height={513}
                className="h-full w-full rounded-3xl object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 animate-fade-up" style={{ animationDelay: "60ms" }}>
            <h2 className="text-2xl font-semibold leading-snug sm:text-3xl min-[1600px]:text-[60px] min-[1600px]:leading-[90px]">
              AI-driven automation with human expertise to deliver unmatched accuracy and efficiency.
            </h2>
            <p className="mt-4 text-sm text-white/80 min-[1600px]:mt-[22px] min-[1600px]:text-[24px] min-[1600px]:leading-[36px]">
              Our goal is simple: make taxes easy, transparent, and accessible to everyone.
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#5FF7E2] min-[1600px]:mt-[28px] min-[1600px]:text-[21px] min-[1600px]:leading-[31.5px]"
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
