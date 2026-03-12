import Image from "next/image";

export default function Hero() {
  return (
    <div className="min-h-screen bg-[#0D23AD] flex flex-col items-center">
      {/* Navbar would go here */}

      <main className="w-full max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-[#5FF7E2] font-bold tracking-wider text-sm mb-4">
              TAX FILING THAT ACTUALLY FITS YOUR LIFE
            </h1>
            <h2 className="text-4xl md:text-6xl text-white font-extrabold leading-[1.1]">
              Real humans on demand <br />
              <span className="text-white/80">+ AI accuracy.</span>
            </h2>
            <p className="text-xl text-blue-100 mt-6 max-w-lg">
              Fully compliant refund without the stress. Simplify financial management and make tax filing
              effortless.
            </p>
          </div>

          {/* Email/Get Started Bar */}
          <div className="bg-white p-2 rounded-xl flex items-center shadow-2xl max-w-xl">
            <div className="flex items-center gap-3 px-4 flex-1">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0D23AD]/10 text-[#0D23AD]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 12l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="text-[#0D23AD] font-semibold">Try TaxBridge for Free</span>
            </div>
            <button className="bg-[#0D23AD] text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>

        {/* Right Column: Calculator Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-black">
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/ellipse.png"
                alt="profile"
                width={56}
                height={56}
                className="rounded-full w-14 h-14 object-cover border-2 border-blue-100"
              />
              <div>
                <h3 className="font-bold text-lg">Sarah - CPA</h3>
                <p className="text-gray-500 text-sm">Instant Refund Calculator</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center mb-8 border border-gray-100">
              <span className="text-green-600 text-4xl font-black block">$2,485</span>
              <span className="text-gray-500 text-sm">Estimated federal refund</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 ml-1">Annual Income</label>
                <div className="bg-gray-100 p-4 rounded-xl font-bold text-gray-700 mt-1">$50,000</div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-400 ml-1">Federal Tax Withheld</label>
                <div className="bg-gray-100 p-4 rounded-xl font-bold text-gray-700 mt-1">$5,000</div>
              </div>

              <button className="w-full bg-[#0D23AD] text-white py-5 rounded-2xl font-bold text-lg mt-4 hover:bg-blue-800 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
                Calculate
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
