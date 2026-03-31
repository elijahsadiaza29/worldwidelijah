"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Code2, Globe, PenTool, Server, Users, Wrench } from "lucide-react";

interface SkillCategory {
  label: string;
  skills: string[];
}

interface SkillsWidgetProps {
  categories: SkillCategory[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function getIconForCategory(label: string) {
  const l = label.toLowerCase();
  if (l.includes("front")) return Code2;
  if (l.includes("back") || l.includes("system")) return Server;
  if (l.includes("tool") || l.includes("devops")) return Wrench;
  if (l.includes("design") || l.includes("creative")) return PenTool;
  if (l.includes("it") || l.includes("network")) return Globe;
  if (l.includes("soft") || l.includes("people")) return Users;
  return Code2;
}

export default function SkillsWidget({ categories }: SkillsWidgetProps) {
  return (
    <motion.div
      className="flex flex-col gap-5 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3
        className="text-lg font-semibold text-foreground tracking-tight"
        variants={categoryVariants}
      >
        Skills & Expertise
      </motion.h3>

      {categories?.map((category) => {
        const Icon = getIconForCategory(category.label);

        return (
          <motion.div
            key={category.label}
            className="flex flex-col gap-2"
            variants={categoryVariants}
          >
            {/* Category header */}
            <div className="flex items-center gap-2">
              <Icon className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {category.label}
              </span>
            </div>

            {/* Skill badges */}
            <motion.div
              className="flex flex-wrap gap-2"
              variants={containerVariants}
            >
              {category.skills.map((skill) => (
                <motion.span key={skill} variants={badgeVariants}>
                  <Badge variant="default" className="rounded-sm">
                    {skill}
                  </Badge>
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
