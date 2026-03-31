"use client";

import { motion } from "framer-motion";

const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "⬢" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Docker", icon: "🐳" },
  { name: "AWS", icon: "☁️" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TechStack() {
  return (
    <div className="mt-16">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground"
      >
        Tech I work with
      </motion.p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        {techStack.map((tech) => (
          <motion.div
            key={tech.name}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            <span className="text-base">{tech.icon}</span>
            {tech.name}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
