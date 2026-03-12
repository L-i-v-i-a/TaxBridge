
import { FileText, Sparkles, 
  Upload, 
  MessageSquare, 
  PlayCircle, 
  Files  } from 'lucide-react';


export default function HomeFeatures() {
  const features = [
    {
      title: "Smart Filing Assistant",
      desc: "Personalized guidance based on your job type, deductions, and previous returns.",
      icon: <FileText className="w-6 h-6 fill-current" />
    },
    {
      title: "AI Tax Analyzer",
      desc: "Detects missing data, errors, or unclaimed credits instantly.",
      icon: <Sparkles className="w-6 h-6 fill-current" />
    },
    {
      title: "Document Upload & OCR",
      desc: "Scan or upload tax documents — the system automatically extracts relevant info.",
      icon: <Upload className="w-6 h-6 stroke-[3px]" />
    },
    {
      title: "Chat with Experts",
      desc: "Real humans available via live chat or video call 24/7.",
      icon: <MessageSquare className="w-6 h-6 fill-current" />
    },
    {
      title: "Progress Tracker",
      desc: "Visual timeline showing your filing status from \"Preparing\" to \"Refund Received.\"",
      icon: <PlayCircle className="w-6 h-6 fill-current" />
    },
    {
      title: "Multi-Year Filing",
      desc: "File for multiple years at once or fix past returns easily.",
      icon: <Files className="w-6 h-6 fill-current" />
    }
  ];

  return (
    <section className="bg-white py-40 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0D153B] mb-4">
            Get to some of our features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get to know some of our Features at Taxbridge which provide the best service for our Users.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((item, index) => (
            <div key={index} className="flex gap-4">
              {/* Icon Container */}
              <div className="flex-shrink-0 bg-[#0D23AD] text-white p-2.5 rounded-lg h-fit">
                {item.icon}
              </div>
              
              {/* Text Content */}
              <div>
                <h3 className="text-xl font-bold text-[#0D153B] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}