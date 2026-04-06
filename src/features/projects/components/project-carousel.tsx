"use client";

import type { ProjectMedia } from "@/lib/getPortfolioContext";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedProject, setSelectedProject] = useState<ProjectMedia | null>(null);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) setVisibleCount(1.4);
      else if (window.innerWidth < 1024) setVisibleCount(2.4);
      else setVisibleCount(3.4);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const checkScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    
    // We allow a tiny sub-pixel margin of error for math calculation on high-dpi displays
    setCanPrev(scrollLeft > 1);
    setCanNext(Math.ceil(scrollLeft + clientWidth + 1) < scrollWidth);
  }, []);

  useEffect(() => {
    checkScroll();
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", checkScroll, { passive: true });
      return () => currentContainer.removeEventListener("scroll", checkScroll);
    }
  }, [checkScroll, projects.length, visibleCount]);

  // Initial highlight auto-scroll
  useEffect(() => {
    if (highlightName && containerRef.current) {
        const idx = projects.findIndex(
          (p) => p.name.toLowerCase() === highlightName.toLowerCase()
        );
        if (idx > 0) {
           const cardWidth = containerRef.current.scrollWidth / projects.length;
           containerRef.current.scrollTo({ left: cardWidth * idx, behavior: "smooth" });
        }
    }
  }, [highlightName, projects, visibleCount]);

  const GAP = 16; 

  const scrollByDirection = (direction: -1 | 1) => {
    if (!containerRef.current) return;
    // Scroll completely past one "full page" of items, aligned to exact widths
    const slideWidth = containerRef.current.clientWidth;
    // Attempt to slide 1 item width on mobile, or nearly the full slide width on desktop
    const itemWidth = containerRef.current.scrollWidth / projects.length;
    const distance = window.innerWidth < 640 ? itemWidth : slideWidth * 0.8;

    containerRef.current.scrollBy({ left: distance * direction, behavior: "smooth" });
  };

  return (
    <div className="w-full select-none cursor-grab active:cursor-grabbing">
      <div 
        ref={containerRef}
        className="relative overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x"
      >
        <div className="flex gap-4 pb-2">
          {projects.map((project, i) => (
            <div 
              key={`${project.name}-${i}`}
              className="snap-center shrink-0 transition-transform duration-300"
              style={{
                width: `calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`,
              }}
            >
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
                width="100%"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 hidden md:block">
        <CarouselControls
          onPrev={() => scrollByDirection(-1)}
          onNext={() => scrollByDirection(1)}
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
