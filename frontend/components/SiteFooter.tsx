export default function SiteFooter() {
  return (
    <footer className="bg-[#0E1224] text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <p className="text-lg font-semibold text-white">Taxbridge</p>
          <p className="mt-3 text-xs text-white/60">
            The TaxBridge is designed for simplicity and control. Every tool you need.
          </p>
          <div className="mt-4 flex items-center gap-3 text-white/60">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">f</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">in</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">ig</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">x</span>
          </div>
        </div>

        <div className="space-y-2 text-xs animate-fade-up" style={{ animationDelay: "120ms" }}>
          <p className="text-sm font-semibold text-white">Company</p>
          <p>About us</p>
          <p>Contact us</p>
          <p>Careers</p>
          <p>Press</p>
        </div>
        <div className="space-y-2 text-xs animate-fade-up" style={{ animationDelay: "180ms" }}>
          <p className="text-sm font-semibold text-white">Product</p>
          <p>Features</p>
          <p>Pricing</p>
          <p>News</p>
          <p>Help desk</p>
          <p>Support</p>
        </div>
        <div className="space-y-2 text-xs animate-fade-up" style={{ animationDelay: "240ms" }}>
          <p className="text-sm font-semibold text-white">Services</p>
          <p>AI Chatbot</p>
          <p>Taxfiling</p>
          <p>Tax Return</p>
          <p>Live Chat</p>
        </div>
        <div className="space-y-2 text-xs animate-fade-up" style={{ animationDelay: "300ms" }}>
          <p className="text-sm font-semibold text-white">Legal</p>
          <p>Privacy Policy</p>
          <p>Terms &amp; Conditions</p>
          <p>Return Policy</p>
        </div>
      </div>
    </footer>
  );
}
