"use client";

import CloudinaryMedia from "@/components/shared/cloudinary-media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveModal, ResponsiveModalTitle, ResponsiveModalScrollArea } from "@/components/shared/responsive-modal";
import type { ProjectMedia } from "@/lib/getPortfolioContext";
import { ChevronRight, ExternalLink, Github } from "lucide-react";
import { useVideoIntersection } from "@/hooks/use-video-intersection";

interface ProjectDetailsDialogProps {
  project: ProjectMedia | null;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailsDialog({
  project,
  onOpenChange,
}: ProjectDetailsDialogProps) {
  const videoRef = useVideoIntersection();

  return (
    <ResponsiveModal 
      open={!!project} 
      onOpenChange={onOpenChange}
      contentClassName="w-full max-w-2xl lg:max-w-5xl bg-background dark:bg-secondary text-foreground rounded-t-2xl sm:rounded-4xl"
    >
      {project && (
          <ResponsiveModalScrollArea className="max-h-[85vh] sm:max-h-[85vh] w-full">
            <div className="flex flex-col p-5 sm:p-8 lg:p-12 gap-6 sm:gap-8 lg:gap-10">
              {/* Header */}
              <div className="flex flex-col gap-1.5 sm:gap-3">
                <span className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]">
                  {project.category}
                </span>
                <ResponsiveModalTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                  {project.name}
                </ResponsiveModalTitle>
              </div>

              {/* Details card */}
              <div className="bg-muted/60 dark:bg-primary/5 rounded-2xl sm:rounded-4xl p-4 sm:p-6 lg:p-10 flex flex-col gap-5 sm:gap-8">
                <span className="text-muted-foreground text-xs uppercase font-light">
                  {project.year}
                </span>

                <p className="text-foreground/80 text-sm sm:text-base lg:text-[18px] leading-relaxed font-normal">
                  {project.description}
                </p>

                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-xs uppercase font-light">
                    Technologies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.tech
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <Badge
                          key={t}
                          variant="default"
                          className="px-3 py-1.5 sm:px-4 sm:py-4 text-xs sm:text-sm font-medium"
                        >
                          {t}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
                    Links
                  </span>
                  <ExternalLink className="size-3 text-muted-foreground/30" />
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                  {project.liveUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-between h-12 sm:h-14 px-5 sm:px-8 rounded-xl sm:rounded-2xl border-border/30 bg-muted/10 hover:bg-muted/30 transition-colors group"
                      nativeButton={false}
                      render={
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      <span className="text-sm font-semibold text-foreground/80">
                        Website
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground/40 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                  {project.github && (
                    <Button
                      variant="outline"
                      className="w-full justify-between h-12 sm:h-14 px-5 sm:px-8 rounded-xl sm:rounded-2xl border-border/30 bg-muted/10 hover:bg-muted/30 transition-colors group"
                      nativeButton={false}
                      render={
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      <span className="text-sm font-semibold text-foreground/80">
                        Github
                      </span>
                      <Github className="size-4 text-muted-foreground/40 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Media */}
              <div className="flex flex-col gap-3 sm:gap-4">
                {project.video && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-3xl bg-zinc-900 border border-border/10">
                    <video
                      ref={videoRef}
                      src={project.video}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  </div>
                )}

                {project.images?.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-3xl"
                  >
                    <CloudinaryMedia
                      url={imgUrl}
                      type="image"
                      alt={`${project.name} media ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}

                {!project.video &&
                  (!project.images || project.images.length === 0) && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-3xl bg-[#0c0c0e] border border-border/10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.3)_0%,transparent_60%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.25)_0%,transparent_60%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.2)_0%,transparent_50%)]" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/50" />
                    </div>
                  )}
              </div>
            </div>
          </ResponsiveModalScrollArea>
      )}
    </ResponsiveModal>
  );
}
