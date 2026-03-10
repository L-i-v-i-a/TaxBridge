export default function Nav() {
  return (
    <section className="bg-blue-400">
    <nav className="bg-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a className="text-xl font-bold text-gray-800 hover:text-gray-600" href="/home">
              Taxbridge
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" href="/home">
              Home
            </a>
            <a className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" href="/features">
              Features
            </a>
            <a className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" href="/pricing">
              Pricing
            </a>
            <a className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" href="/about-us">
              About us
            </a>
            <a className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" href="/contact">
              Contact
            </a>
          </div>

          
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Login
            </button>
            <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
    </section>
  );
}
