export default function CtaSection() {
  return (
    <section className="bg-[#151a2c] py-16 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-xl font-semibold">Ready to start Tax Filing?</h3>
          <p className="mt-2 text-sm text-white/70">
            You can start filing immediately you create account and login,
            <br />
            your dashboard will be set up for you. Start now!
          </p>
        </div>
        <button className="rounded-md bg-[#102b9a] px-5 py-2 text-sm font-semibold text-white shadow-sm">
          Get started for filing
        </button>
      </div>
    </section>
  );
}

