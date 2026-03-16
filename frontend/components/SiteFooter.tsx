import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-[#0E1224] text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <Link className="text-lg font-semibold text-white" href="/home">
            Taxbridge
          </Link>
          <p className="mt-3 text-xs text-white/60">
            The TaxBridge is designed for simplicity and control. Every tool you need.
          </p>
          <div className="mt-4 flex items-center gap-3 text-white/60">
            <a
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              href="https://www.facebook.com/taxbridge"
              aria-label="Taxbridge on Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-white"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22 12.06c0-5.52-4.48-10-10-10S2 6.54 2 12.06c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.9h-2.32v6.99C18.34 21.19 22 17.05 22 12.06z" />
              </svg>
            </a>
            <a
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              href="https://www.linkedin.com/company/taxbridge"
              aria-label="Taxbridge on LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-white"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.96v5.66H9.32V9h3.42v1.56h.05c.48-.9 1.66-1.85 3.41-1.85 3.65 0 4.32 2.4 4.32 5.52v6.22zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
            <a
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              href="https://www.instagram.com/taxbridge"
              aria-label="Taxbridge on Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-white"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.51 4.51 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.25 6.75a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
              </svg>
            </a>
            <a
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              href="https://x.com/taxbridge"
              aria-label="Taxbridge on X"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-white"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.9 2H22l-6.78 7.75L23 22h-6.2l-4.86-6.35L6.24 22H3l7.3-8.35L1 2h6.33l4.4 5.73L18.9 2zm-1.1 18h1.72L7.26 3.92H5.4L17.8 20z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-2 text-xs animate-fade-up" style={{ animationDelay: "120ms" }}>
          <p className="text-sm font-semibold text-white">Company</p>
          <Link className="block transition hover:text-white" href="/about">
            About us
          </Link>
          <Link className="block transition hover:text-white" href="/contact">
            Contact us
          </Link>
          <Link className="block transition hover:text-white" href="/careers">
            Careers
          </Link>
          <Link className="block transition hover:text-white" href="/press">
            Press
          </Link>
        </div>
        <div className="space-y-2 text-xs animate-fade-up" style={{ animationDelay: "180ms" }}>
          <p className="text-sm font-semibold text-white">Product</p>
          <Link className="block transition hover:text-white" href="/features">
            Features
          </Link>
          <Link className="block transition hover:text-white" href="/pricing">
            Pricing
          </Link>
          <Link className="block transition hover:text-white" href="/news">
            News
          </Link>
          <Link className="block transition hover:text-white" href="/helpdesk">
            Help desk
          </Link>
          <Link className="block transition hover:text-white" href="/support">
            Support
          </Link>
        </div>
        <div className="space-y-2 text-xs animate-fade-up" style={{ animationDelay: "240ms" }}>
          <p className="text-sm font-semibold text-white">Services</p>
          <Link className="block transition hover:text-white" href="/signin">
            AI Chatbot
          </Link>
          <Link className="block transition hover:text-white" href="/signin">
            Taxfiling
          </Link>
          <Link className="block transition hover:text-white" href="/signin">
            Tax Return
          </Link>
          <Link className="block transition hover:text-white" href="/signin">
            Live Chat
          </Link>
        </div>
        <div className="space-y-2 text-xs animate-fade-up" style={{ animationDelay: "300ms" }}>
          <p className="text-sm font-semibold text-white">Legal</p>
          <Link className="block transition hover:text-white" href="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="block transition hover:text-white" href="/terms-and-conditions">
            Terms &amp; Conditions
          </Link>
          <Link className="block transition hover:text-white" href="/return-policy">
            Return Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
