import React from 'react';
import Image from 'next/image';

interface FeatureItem {
  text: string;
}

const features: FeatureItem[] = [
  { text: "Our mission is to make personal and small business finance simple, smart, and stress-free." },
  { text: "We combine artificial intelligence and human expertise to create a hybrid experience that empowers users to manage their income." },
  { text: "track expenses, store financial documents, and file taxes anytime, anywhere." },
  { text: "It was designed for people who want accuracy without complexity, flexibility without confusion, and support without delays." },
];

const WhoWeAre: React.FC = () => {
  return (
    <section className="py-16 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Image */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-3xl shadow-xl">
          <Image
            src="/cpa.png" // Replace with your actual image path
            alt="TaxBridge team working"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Side: Content */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">Who We Are</h2>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            TaxBridge is a <span className="font-semibold">cutting-edge financial and tax management</span> web application developed by Tax Bridge Software.
          </p>

          <ul className="space-y-5">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-4">
                {/* Custom Blue Checkmark Icon */}
                <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center">
                  <svg 
                    className="w-3.5 h-3.5 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 leading-snug">
                  {feature.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};

export default WhoWeAre;