import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Price", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function MarketingNavbar() {
  return (
    <header className="bg-[#102b9a] text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="text-lg font-semibold tracking-wide">Taxbridge</div>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-white/80">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <button className="hidden text-white/90 transition hover:text-white md:inline-flex">
            Signup
          </button>
          <button className="rounded-md bg-white px-4 py-2 font-semibold text-[#102b9a] shadow-sm transition hover:bg-white/90">
            Login
          </button>
        </div>
      </div>
      <div className="md:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 pb-4 text-xs text-white/90">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="rounded-full border border-white/20 px-3 py-1">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

