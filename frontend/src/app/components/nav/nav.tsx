export default function Nav() {
  return (
    <section className="bg-[#0D23AD]">
    <nav className="bg-[#0D23AD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a className="text-xl font-bold text-white hover:text-gray-300" href="/home">
              Taxbridge
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" href="/home">
              Home
            </a>
            <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" href="/features">
              Features
            </a>
            <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" href="/pricing">
              Pricing
            </a>
            <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" href="/about-us">
              About us
            </a>
            <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium" href="/contact">
              Contact
            </a>
          </div>

          
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
              Login
            </button>
            <button className="bg-white text-[#0D23AD] hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
    </section>
  );
}
