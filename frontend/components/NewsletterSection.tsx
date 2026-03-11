export default function NewsletterSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 lg:flex-row lg:items-center">
        <h3 className="text-lg font-semibold text-[#0B0F1F]">
          Subscribe to our newsletter to get latest news on your inbox.
        </h3>
        <form className="flex w-full max-w-md items-center gap-3 rounded-full bg-[#F1F3F9] p-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-transparent px-3 text-sm text-slate-600 outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full bg-[#0D23AD] px-5 py-2 text-sm font-semibold text-white"
          >
            Subscribe
            <span aria-hidden>→</span>
          </button>
        </form>
      </div>
    </section>
  );
}
