import Link from "next/link";

export default function ReadyToStartSection() {
  return (
    <section className="bg-[#121729] text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 lg:flex-row lg:items-center">
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <h3 className="text-xl font-semibold">Ready to start Tax Filing?</h3>
          <p className="mt-2 text-sm text-white/70">
            You can start filing immediately you create account and login, your dashboard will be set up
            for you. Start now!
          </p>
        </div>
        <Link
          className="animate-fade-up rounded-full bg-[#0D23AD] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0C1F74]"
          style={{ animationDelay: "140ms" }}
          href="/signup"
        >
          Get started for filing
        </Link>
      </div>
    </section>
  );
}
