
"use client";

import { motion } from "framer-motion";
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.3 }
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      rotate: 360,
      transition: { duration: 0.6 }
    },
  };

  return (
    <motion.section
      className="bg-white py-40 px-4 md:px-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
        >
          <motion.h2
            className="text-4xl font-bold text-[#0D153B] mb-4"
            variants={headerVariants}
          >
            Get to some of our features
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            variants={headerVariants}
          >
            Get to know some of our Features at Taxbridge which provide the best service for our Users.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          variants={containerVariants}
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="flex gap-4"
              variants={cardVariants}
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              {/* Icon Container */}
              <motion.div
                className="flex-shrink-0 bg-[#0D23AD] text-white p-2.5 rounded-lg h-fit"
                variants={iconVariants}
                whileHover="hover"
              >
                {item.icon}
              </motion.div>

              {/* Text Content */}
              <motion.div
                variants={cardVariants}
              >
                <motion.h3
                  className="text-xl font-bold text-[#0D153B] mb-2"
                  variants={cardVariants}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="text-gray-500 text-sm leading-relaxed"
                  variants={cardVariants}
                >
                  {item.desc}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}