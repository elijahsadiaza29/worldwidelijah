"use client";

import { motion } from "framer-motion";

export function WelcomeScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center px-6 select-none"
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight max-w-3xl">
        <motion.span
          className="inline-block origin-[70%_70%]"
          animate={{
            rotate: [0, 18, -8, 14, -4, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            delay: 0.7,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          }}
          aria-hidden="true"
        >
          👋
        </motion.span>{" "}
        Hi, I&apos;m Elijah.{" "}
        {/* <span className="block sm:inline">How can I help you today?</span> */}
      </h1>

      <p className="mt-5 text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
        You can ask about my experience, projects, or just say hello!
      </p>
    </motion.div>
  );
}
