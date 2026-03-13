"use client";

import { motion } from "framer-motion";

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
];

const desktopLayout = [
  { left: 200, top: 40, width: 406, height: 384 },
  { left: 571, top: 0, width: 486, height: 464 },
  { left: 1022, top: 40, width: 406, height: 384 },
];

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
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3 }
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
      <motion.div
        className="text-center"
        variants={itemVariants}
      >
        <motion.h1
          className="text-2xl font-semibold text-[#0B0F1F] min-[1600px]:text-[40px] min-[1600px]:leading-[60px]"
          variants={itemVariants}
        >
          Our Key Features
        </motion.h1>
        <motion.p
          className="mt-2 text-sm text-slate-500 min-[1600px]:text-[24px] min-[1600px]:leading-[36px]"
          variants={itemVariants}
        >
          Get to know some of our Features at Taxbridge which provide the best service for our Users.
        </motion.p>
      </motion.div>

      <motion.div
        className="mt-8 flex items-center justify-end gap-2"
        variants={itemVariants}
      >
        <motion.button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:text-slate-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          &larr;
        </motion.button>
        <motion.button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:text-slate-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          &rarr;
        </motion.button>
      </motion.div>

      <div className="mt-8 min-[1600px]:mt-[68px]">
        <div className="relative hidden min-[1600px]:block min-[1600px]:h-[464px] min-[1600px]:w-[1600px] min-[1600px]:mx-auto">
          {featureCards.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="rounded-[28px] border border-slate-100 bg-white p-7 text-center shadow-sm"
              style={{
                left: desktopLayout[index].left,
                top: desktopLayout[index].top,
                width: desktopLayout[index].width,
                height: desktopLayout[index].height,
                position: "absolute",
              }}
              variants={cardVariants}
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E9F1FF]"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.5L14.5 7.5L20 10L14.5 12.5L12 17.5L9.5 12.5L4 10L9.5 7.5L12 2.5Z"
                    fill="#0D23AD"
                  />
                </svg>
              </motion.div>
              <motion.h3
                className="mt-4 text-[24px] font-semibold leading-[30px] text-[#0B0F1F]"
                variants={itemVariants}
              >
                {feature.title}
              </motion.h3>
              <motion.p
                className="mt-3 text-[18px] leading-[23px] text-slate-500"
                variants={itemVariants}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-3 min-[1600px]:hidden"
          variants={containerVariants}
        >
          {featureCards.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-sm"
              variants={cardVariants}
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E9F1FF]"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.5L14.5 7.5L20 10L14.5 12.5L12 17.5L9.5 12.5L4 10L9.5 7.5L12 2.5Z"
                    fill="#0D23AD"
                  />
                </svg>
              </motion.div>
              <motion.h3
                className="mt-4 text-base font-semibold text-[#0B0F1F]"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
