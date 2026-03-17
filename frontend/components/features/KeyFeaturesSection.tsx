"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const featureCards = [
  {
    title: "AI-Powered Tax Analyzer",
    description:
      "Instantly detects missed deductions or inconsistencies. Suggests optimization tips in real time.",
  },
  {
    title: "Personalized Dashboard",
    description:
      "See your income summary, filing status, refund estimate, and pending tasks in one glance.",
  },
  {
    title: "Human Expert Chat",
    description:
      "Real-time chat or video consultation with certified tax experts. Multilingual support.",
  },
  {
    title: "Smart Deduction Finder",
    description:
      "Highlights common deductions and documents you may have missed.",
    image: "/feature-cards/ai-tax-analyzer.png",
  },
  {
    title: "Realtime Filing Insights",
    description:
      "Track refund progress, deadlines, and compliance status as you file.",
    image: "/feature-cards/personal-dashboard.png",
  },
  {
    title: "Priority Expert Support",
    description:
      "Get faster access to certified experts during peak filing periods.",
    image: "/feature-cards/expert-chat.png",
  },
];
const loopedCards = [...featureCards, ...featureCards];

export default function KeyFeaturesSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
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
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -6,
      scale: 1.01,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.section
      className="mx-auto w-full max-w-[1600px] px-6 py-16 min-[1600px]:px-0 min-[1600px]:py-[96px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div className="text-center" variants={itemVariants}>
        <motion.h1
          className="text-4xl font-bold text-[#0B0F1F] min-[1600px]:text-[40px] min-[1600px]:leading-[60px]"
          variants={itemVariants}
        >
          Our Key Features
        </motion.h1>
        <motion.p
          className="mt-2 text-sm text-slate-800 min-[1600px]:text-[24px] min-[1600px]:leading-[36px]"
          variants={itemVariants}
        >
          Get to know some of our Features at Taxbridge which provide the best
          service for our Users.
        </motion.p>
      </motion.div>

      <div className="mt-8 min-[1600px]:mt-[68px]">
        <div className="relative overflow-hidden">
          <div className="feature-cards-track flex w-max gap-6">
            {loopedCards.map((feature, index) => (
              <motion.div
                key={`${feature.title}-${index}`}
                className="w-[280px] shrink-0 md:w-[320px] min-[1600px]:w-[360px]"
                variants={cardVariants}
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                <div className="rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-sm h-[320px] flex flex-col">
                  <motion.div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E9F1FF]"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.image ? (
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={36}
                        height={36}
                        className="h-9 w-9 object-contain"
                      />
                    ) : (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 2.5L14.5 7.5L20 10L14.5 12.5L12 17.5L9.5 12.5L4 10L9.5 7.5L12 2.5Z"
                          fill="#0D23AD"
                        />
                      </svg>
                    )}
                  </motion.div>
                  <motion.h3
                    className="mt-4 text-base font-semibold text-[#0B0F1F] md:text-lg min-[1600px]:text-[20px]"
                    variants={itemVariants}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    className="mt-3 text-sm text-slate-500"
                    variants={itemVariants}
                  >
                    {feature.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .feature-cards-track {
          animation: feature-cards-marquee 24s linear infinite;
        }
        @keyframes feature-cards-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </motion.section>
  );
}
