"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionContainerProps {
  id: string;
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function SectionContainer({
  id,
  children,
  className = "",
  title,
  subtitle,
}: SectionContainerProps) {
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            {title && (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
