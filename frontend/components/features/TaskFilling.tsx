export default function TaxFiling() {
  return (
    <div className="min-h-screen bg-[#0D23AD] flex items-center justify-center p-8 md:p-16 text-white font-sans overflow-hidden">
      
      {/* Container for the two columns */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full max-w-7xl relative z-10">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="flex-1 flex flex-col gap-8">
          <h1 className="font-bold text-5xl lg:text-7xl leading-[1.1] tracking-tight">
            Tax filing shouldn't <br className="hidden lg:block" />
            be stressful or <br className="hidden lg:block" />
            confusing
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-xl leading-relaxed">
            Our mission is to bridge the gap between advanced 
            automation and real human expertise to make tax 
            filing seamless for everyone.
          </p>
          
          {/* Get Started Button */}
          <div className="flex items-center gap-3 text-[#5FF7E2] font-bold text-lg cursor-pointer group hover:opacity-80 transition-all">
            <span className="border-b-2 border-transparent group-hover:border-[#5FF7E2] pb-1">Get Started</span>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="group-hover:translate-x-2 transition-transform duration-300"
            >
              <path 
                d="M5 12H19M19 12L13 6M19 12L13 18" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

       {/* RIGHT COLUMN: Professional Video Frame */}
<div className="flex-1 w-full max-w-2xl relative">
  
  {/* Decorative Background Glow */}
  <div className="absolute -inset-4 bg-gradient-to-tr from-[#5FF7E2]/20 to-[#473BF0]/30 blur-2xl rounded-[20px] opacity-50" />

  {/* Main Video Container: 'overflow-hidden' is key here */}
  <div className="relative w-full aspect-video rounded-none overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-black border border-white/10">
    
    {/* We scale the iframe to 115% and center it. 
      This 'crops' the YouTube title bar and logo out of view.
    */}
    <iframe 
      className="absolute top-1/2 left-1/2 w-[150%] h-[170%] -translate-x-1/2 -translate-y-1/2"
      src="https://www.youtube.com/embed/qDXaWY4H0Es?autoplay=0&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3" 
      title="YouTube video player" 
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowFullScreen
    />

    {/* Transparent 'Shield' - Optional: Prevents clicking the title, but allows clicking the play button */}
    <div className="absolute top-0 left-0 w-full h-20 bg-transparent z-10" />
  </div>

  {/* Subtle Reflection Overlay */}
  <div className="absolute inset-0 rounded-none pointer-events-none ring-1 ring-inset ring-white/20" />
</div>
</div>
</div>
  );
}