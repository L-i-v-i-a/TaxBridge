'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D23AD] shadow-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="text-xl font-semibold text-white" href="/home">
          Taxbridge
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop Auth Links */}
        <div className="hidden items-center gap-4 md:flex">
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

        {/* Mobile Menu Button */}
        <button
          className="text-white md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0D23AD] md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                className="text-white transition hover:text-white/80"
                href="/home"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                className="text-white transition hover:text-white/80"
                href="/features"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                className="text-white transition hover:text-white/80"
                href="/pricing"
                onClick={() => setIsMenuOpen(false)}
              >
                Price
              </Link>
              <Link
                className="text-white transition hover:text-white/80"
                href="/about"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                className="text-white transition hover:text-white/80"
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <hr className="border-white/10" />
              <div className="flex flex-col space-y-2">
                <Link
                  className="text-white transition hover:text-white/80"
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
                <Link
                  className="rounded-md bg-white px-4 py-2 text-center font-semibold text-[#0D23AD] shadow-sm transition hover:bg-white/90"
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove the old mobile nav */}
    </header>
  );
}
