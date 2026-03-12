import Image from "next/image";
import Link from "next/link";

export default function AuthLeftPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#1533B0] text-white">
      <div className="absolute inset-0">
        <Image
          src="/image.png"
          alt="TaxBridge background"
          fill
          className="object-cover opacity-25"
        />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-center px-10 py-12 min-[1440px]:px-[40px]">
        <div className="mb-10 flex items-center">
          <Link
            href="/"
            className="rounded-full border border-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:border-white cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
        <h1 className="text-[40px] font-semibold leading-[52px] min-[1440px]:text-[55px] min-[1440px]:leading-[64px]">
          Tax filing shouldn&apos;t
          <br />
          be stressful or
          <br />
          confusing
        </h1>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#5FF7E2] min-[1440px]:text-[20px] min-[1440px]:leading-[32px]">
          Tax Filing That Actually Fits Your Life
        </p>
      </div>
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white">
          &larr;
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white">
          &rarr;
        </span>
      </div>
    </div>
  );
}
