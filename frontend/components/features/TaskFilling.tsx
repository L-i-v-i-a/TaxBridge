"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";

export default function TaxFiling() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // The correct ID from your link
  const videoId = "qDXaWY4H0Es";

  // Animation variants
  // Explicitly typing this as Variants solves the "ease" type error
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-8 md:p-16 text-white font-sans overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >

      {/* 1. THE MODAL OVERLAY */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#5FF7E2] transition-colors text-4xl font-light"
          >
            &times;
          </button>

          {/* Video Container in Modal */}
          <motion.div
            className="w-full max-w-3xl aspect-video bg-black shadow-2xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </motion.div>
        </motion.div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full max-w-7xl relative z-10">

        {/* LEFT COLUMN: Text */}
        <motion.div
          className="flex-1 flex flex-col gap-8"
          variants={itemVariants}
        >
          <motion.h1
            className="font-bold text-7xl lg:text-5xl leading-[1.1] tracking-tight"
            variants={itemVariants}
          >
            Tax filing shouldn&apos;t <br className="hidden lg:block" />
            be stressful or <br className="hidden lg:block" />
            confusing
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-blue-100 max-w-xl leading-relaxed"
            variants={itemVariants}
          >
            Our mission is to bridge the gap between advanced
            automation and real human expertise to make tax
            filing seamless for everyone.
          </motion.p>
          <motion.div
            className="flex items-center gap-3 text-[#5FF7E2] font-bold text-lg cursor-pointer group hover:opacity-50 transition-all"
            variants={itemVariants}
          >
            <span className="border-b-2 border-transparent group-hover:border-[#5FF7E2] pb-1">Get Started</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-2 transition-transform duration-300">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Video Thumbnail (Always Visible) */}
        <motion.div
          className="flex-1 w-full max-w-2xl relative"
          variants={itemVariants}
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#5FF7E2]/20 to-[#473BF0]/30 blur-2xl rounded-[20px] opacity-20" />

          <motion.div
            className="relative w-full aspect-video rounded-none overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-black border border-white/10"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* The png is always here */}
            <img
              className="absolute top-1/2 left-1/2 w-[120%] h-[110%] -translate-x-1/2 -translate-y-1/2 object-cover"
              src="/video.png"
              alt="Video Thumbnail"
            />

            {/* Play Button triggers the Modal */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="85" height="85" viewBox="0 0 105 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="52.2515" cy="53.8467" rx="52.2515" ry="53.8467" fill="white"/>
                <path d="M58.8897 53.5226L45.9582 45.7012C45.85 45.6357 45.7172 45.6364 45.6097 45.7032C45.5021 45.7699 45.436 45.8926 45.436 46.0252V61.6681C45.436 61.8007 45.5021 61.9234 45.6097 61.9901C45.7172 62.0569 45.85 62.0576 45.9582 61.9921L58.8897 54.1707C58.9992 54.1045 59.0669 53.9808 59.0669 53.8466C59.0669 53.7125 58.9992 53.5887 58.8897 53.5226Z" fill="#473BF0"/>
              </svg>
            </motion.button>

            <div className="absolute top-0 left-0 w-full h-20 bg-transparent z-10" />
          </motion.div>
          <div className="absolute inset-0 rounded-none pointer-events-none ring-1 ring-inset ring-white/20" />
        </motion.div>
      </div>
    </motion.div>
  );
}