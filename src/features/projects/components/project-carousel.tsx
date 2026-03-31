"use client";

import type { ProjectMedia } from "@/lib/getPortfolioContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CarouselControls } from "./carousel-controls";
import { ProjectCard } from "./project-card";
import { ProjectDetailsDialog } from "./project-details-dialog";

interface ProjectCarouselProps {
  projects: ProjectMedia[];
  highlightName?: string;
}

export default function ProjectCarousel({
  projects,
  highlightName,
}: ProjectCarouselProps) {
  const [current, setCurrent] = useState(() => {
    if (highlightName) {
      const idx = projects.findIndex(
        (p) => p.name.toLowerCase() === highlightName.toLowerCase(),
      );
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedProject, setSelectedProject] = useState<ProjectMedia | null>(
    null,
  );

  useEffect(() => {
    const updateCount = () => {
      // Re-adjusted fractional counts for stability
      if (window.innerWidth < 640) setVisibleCount(1.4);
      else if (window.innerWidth < 1024) setVisibleCount(2.4);
      else setVisibleCount(3.4);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const GAP = 16; // 4 * 4px (gap-4)
  const canPrev = current > 0;
  const canNext = current < projects.length - Math.floor(visibleCount);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden no-scrollbar">
        <motion.div
          className="flex gap-4"
          animate={{
            x: `calc(-${current * (100 / visibleCount)}% - ${current * (GAP / visibleCount)}px)`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={`${project.name}-${i}`}
              project={project}
              onClick={() => setSelectedProject(project)}
              width={`calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`}
            />
          ))}
        </motion.div>
      </div>

      <div className="mt-4">
        <CarouselControls
          onPrev={() => setCurrent((c: number) => Math.max(0, c - 1))}
          onNext={() =>
            setCurrent((c: number) =>
              Math.min(Math.max(0, projects.length - visibleCount), c + 1),
            )
          }
          canPrev={canPrev}
          canNext={canNext}
        />
      </div>

      <ProjectDetailsDialog
        project={selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      />
    </div>
  );
}
