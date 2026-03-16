import Link from "next/link";
import Nav from "./nav";
import SiteFooter from "./SiteFooter";

type InfoPageProps = {
  title: string;
  description: string;
};

export default function InfoPage({ title, description }: InfoPageProps) {
  return (
    <main className="min-h-screen bg-[#F7F9FF] text-[#0B0F1F] pt-20">
      <Nav />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <nav className="text-xs text-black/60">
          <Link className="transition hover:text-[#2F4AD0]" href="/home">
            Home
          </Link>{" "}
          / <span className="text-black/80">{title}</span>
        </nav>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-[#2F4AD0]">
          Taxbridge
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-[#0B0F1F]">{title}</h1>
        <p className="mt-4 text-base text-black/70">{description}</p>
        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/70">
          We are polishing this page with more resources. Check back soon for the full
          details.
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            className="rounded-full bg-[#2F4AD0] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#2337a3]"
            href="/contact"
          >
            Talk to support
          </Link>
          <Link
            className="rounded-full border border-black/10 px-6 py-3 text-xs font-semibold text-black/70 transition hover:border-black/20 hover:text-black"
            href="/pricing"
          >
            View pricing
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
