const featureCards = [
  {
    title: "AI-Powered Tax Analyzer",
    description:
      "Instantly detects missed deductions or inconsistencies. Suggests optimization tips in real time.",
  },
  {
    title: "Personalized Dashboard",
    description:
      "See your income summary, filing status, refund estimate, and pending tasks in one glance.",
  },
  {
    title: "Human Expert Chat",
    description:
      "Real-time chat or video consultation with certified tax experts. Multilingual support.",
  },
];

export default function KeyFeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center animate-fade-up" style={{ animationDelay: "60ms" }}>
        <h1 className="text-2xl font-semibold text-[#0B0F1F] sm:text-3xl">Our Key Features</h1>
        <p className="mt-2 text-sm text-slate-500">
          Get to know some of our Features at Taxbridge which provide the best service for our Users.
        </p>
      </div>

      <div
        className="mt-8 flex items-center justify-end gap-2 animate-fade-up"
        style={{ animationDelay: "120ms" }}
      >
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:text-slate-600">
          &larr;
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:text-slate-600">
          &rarr;
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {featureCards.map((feature, index) => (
          <div
            key={feature.title}
            className="animate-fade-up rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${180 + index * 120}ms` }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E9F1FF]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2.5L14.5 7.5L20 10L14.5 12.5L12 17.5L9.5 12.5L4 10L9.5 7.5L12 2.5Z"
                  fill="#0D23AD"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#0B0F1F]">{feature.title}</h3>
            <p className="mt-3 text-sm text-slate-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
