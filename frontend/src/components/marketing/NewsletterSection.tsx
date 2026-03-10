export default function NewsletterSection() {
  return (
    <section className="bg-[#f1f2f7] py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-xl font-semibold text-[#111827]">
            Subscribe to our newsletter to
            <br />
            get latest news on your inbox.
          </h3>
        </div>
        <div className="flex w-full max-w-md items-center gap-3 rounded-lg bg-white p-2 shadow-sm">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border-none bg-transparent px-2 text-sm text-[#0f172a] outline-none"
          />
          <button className="inline-flex items-center gap-2 rounded-md bg-[#102b9a] px-4 py-2 text-sm font-semibold text-white">
            Subscribe
            <span>?</span>
          </button>
        </div>
      </div>
    </section>
  );
}

