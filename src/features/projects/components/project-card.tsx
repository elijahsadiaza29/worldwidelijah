"use client";

import CloudinaryMedia from "@/components/shared/cloudinary-media";
import type { ProjectMedia } from "@/lib/getPortfolioContext";
import { useVideoIntersection } from "@/hooks/use-video-intersection";

interface ProjectCardProps {
  project: ProjectMedia;
  onClick: () => void;
  width: string;
}

export function ProjectCard({ project, onClick, width }: ProjectCardProps) {
  const videoRef = useVideoIntersection();

  return (
    <div
      onClick={onClick}
      className="group relative flex-shrink-0 overflow-hidden rounded-3xl
                   cursor-pointer select-none
                   transition-shadow duration-300 border"
      style={{
        aspectRatio: "3/4",
        width,
      }}
    >
      {project.video ? (
        <video
          ref={videoRef}
          src={project.video}
          className="absolute inset-0 w-full h-full object-cover
                     transition-transform duration-700
                     group-hover:scale-110"
          muted
          loop
          playsInline
        />
      ) : project.thumbnail ? (
        <CloudinaryMedia
          url={project.thumbnail}
          type="image"
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover
                     transition-transform duration-700
               "
        />
      ) : (
        /* Gradient fallback — Fastfolio dark card style */
        <div
          className="absolute inset-0 bg-gradient-to-br
                        from-blue-800 via-zinc-900 to-black"
        />
      )}

      {/* ── GRADIENT OVERLAY — strong at top for text, fading down ── */}
      <div
        className="absolute inset-0 bg-gradient-to-b
                      from-black/70 via-black/0 to-transparent"
      />

      {/* ── TEXT BLOCK — top-left, category + name stacked ── */}
      <div className="absolute top-4 left-4 right-4 flex flex-col gap-0.5">
        <span
          className="text-white/80 text-[11px] font-semibold
                     uppercase tracking-wider leading-tight"
        >
          {project.category}
        </span>
        <h3
          className="text-white font-bold text-xl leading-tight
                     drop-shadow-md"
        >
          {project.name}
        </h3>
      </div>
    </div>
  );
}
