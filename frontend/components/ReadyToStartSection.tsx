import Link from "next/link";

export default function ReadyToStartSection() {
  return (
    <section className="bg-[#121729] text-white">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-12 min-[1600px]:px-0 min-[1600px]:py-[84px]">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-start min-[1600px]:pl-[237px] min-[1600px]:pr-[237px]">
          <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
            <h3 className="text-xl font-semibold min-[1600px]:text-[32px] min-[1600px]:leading-[45.5px]">
              Ready to start Tax Filing?
            </h3>
            <p className="mt-2 text-sm text-white/70 min-[1600px]:mt-[12px] min-[1600px]:text-[19px] min-[1600px]:leading-[27px]">
              You can start filing immediately you create account and login, your dashboard will be set up
              for you. Start now!
            </p>
          </div>
          <Link
            className="animate-fade-up rounded-full bg-[#0D23AD] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0C1F74] min-[1600px]:px-[24px] min-[1600px]:py-[9px] min-[1600px]:text-[17px]"
            style={{ animationDelay: "140ms" }}
            href="/signup"
          >
            Get started for filing
          </Link>
        </div>
      </div>
    </section>
  );
}
