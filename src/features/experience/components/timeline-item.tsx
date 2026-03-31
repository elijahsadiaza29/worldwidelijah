"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { Experience } from "@/types";

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export default function TimelineItem({ experience, index }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 pb-12 last:pb-0 md:pl-12"
    >
      {/* Timeline line */}
      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent md:left-[19px]" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background md:left-2 md:h-8 md:w-8">
        <Briefcase className="h-3 w-3 text-primary md:h-4 md:w-4" />
      </div>

      {/* Content card */}
      <div className="group rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/20 hover:shadow-[0_0_30px_oklch(0.75_0.18_270_/_8%)]">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{experience.role}</h3>
            <p className="text-sm font-medium text-primary">
              {experience.company}
            </p>
          </div>
          <span className="mt-1 text-sm text-muted-foreground md:mt-0">
            {experience.duration}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {experience.description}
        </p>

        <ul className="mt-4 space-y-2">
          {experience.achievements.map((achievement, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
