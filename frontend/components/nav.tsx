import Link from "next/link";

export default function Nav() {
  return (
    <header className="bg-[#0D23AD] animate-fade-in">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="text-xl font-semibold text-white" href="/home">
          Taxbridge
        </Link>

        <div className="hidden items-center gap-8 text-sm text-white md:flex">
          <Link className="transition hover:text-white/80" href="/home">
            Home
          </Link>
          <Link className="transition hover:text-white/80" href="/features">
            Features
          </Link>
          <Link className="transition hover:text-white/80" href="/pricing">
            Price
          </Link>
          <Link className="transition hover:text-white/80" href="/about">
            About Us
          </Link>
          <Link className="transition hover:text-white/80" href="/contact">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link className="text-sm text-white transition hover:text-white/80" href="/signup">
            Signup
          </Link>
          <Link
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0D23AD] shadow-sm transition hover:bg-white/90"
            href="/login"
          >
            Login
          </Link>
        </div>
      </nav>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 pb-4 text-xs text-white/80 md:hidden">
        <Link className="transition hover:text-white" href="/home">
          Home
        </Link>
        <Link className="transition hover:text-white" href="/features">
          Features
        </Link>
        <Link className="transition hover:text-white" href="/pricing">
          Price
        </Link>
        <Link className="transition hover:text-white" href="/about">
          About Us
        </Link>
        <Link className="transition hover:text-white" href="/contact">
          Contact
        </Link>
      </div>
    </header>
  );
}
