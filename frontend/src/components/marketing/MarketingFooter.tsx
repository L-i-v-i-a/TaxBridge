const footerColumns = [
  {
    title: "Company",
    links: ["About us", "Contact us", "Careers", "Press"],
  },
  {
    title: "Product",
    links: ["Features", "Pricing", "News", "Help desk", "Support"],
  },
  {
    title: "Services",
    links: ["AI Chatbot", "Taxfilling", "Tax Return", "Live Chat"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms & Conditions", "Return Policy"],
  },
];

export default function MarketingFooter() {
  return (
    <footer className="bg-[#14172b] text-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <div className="text-lg font-semibold text-white">Taxbridge</div>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            The Taxbridge is designed for simplicity and control. Every tool you need.
          </p>
          <div className="mt-4 flex items-center gap-3 text-white/60">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs">
              T
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs">
              F
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs">
              I
            </span>
          </div>
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h4 className="text-sm font-semibold text-white">{column.title}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link} className="hover:text-white">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

