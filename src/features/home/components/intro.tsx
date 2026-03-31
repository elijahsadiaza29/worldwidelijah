"use client";

import { motion } from "framer-motion";

export default function Intro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
        With over <span className="font-semibold text-foreground">5 years</span>{" "}
        of experience building web applications, I focus on creating{" "}
        <span className="font-semibold text-foreground">
          performant, accessible, and visually stunning
        </span>{" "}
        digital experiences. I believe great software is a blend of solid
        engineering and thoughtful design.
      </p>
    </motion.div>
  );
}
