"use client";

import CloudinaryMedia from "@/components/shared/cloudinary-media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { ProjectMedia } from "@/lib/getPortfolioContext";
import { ChevronRight, ExternalLink, Github } from "lucide-react";

interface ProjectDetailsDialogProps {
  project: ProjectMedia | null;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailsDialog({
  project,
  onOpenChange,
}: ProjectDetailsDialogProps) {
  return (
    <Dialog open={!!project} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-5xl p-0 overflow-hidden border border-none bg-background dark:bg-secondary text-foreground rounded-4xl"
        initialFocus={false}
      >
        {project && (
          <ScrollArea className="max-h-[85vh]">
            <div className="flex flex-col px-4 py-8 sm:p-12 gap-10">
              {/* Header */}
              <div className="flex flex-col gap-3">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-[0.25em] opacity-80">
                  {project.category}
                </span>
                <DialogTitle className="text-4xl font-bold tracking-tight text-foreground">
                  {project.name}
                </DialogTitle>
              </div>

              {/* Details */}
              <div className="bg-muted/60 dark:bg-primary/5 rounded-4xl p-4 sm:p-10 flex flex-col gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm uppercase font-light opacity-80">
                    {project.year}
                  </span>
                </div>

                <DialogDescription className="text-foreground/80 text-[18px] leading-relaxed max-w-4xl font-normal">
                  {project.description}
                </DialogDescription>

                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-sm uppercase font-light opacity-80">
                    Technologies
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {project.tech
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <Badge
                          key={t}
                          variant="default"
                          className="px-4 py-4 font-medium "
                        >
                          {t}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              {/* Link */}
              <div className="flex flex-col gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-muted-foreground/50 uppercase tracking-widest">
                    Links
                  </span>
                  <ExternalLink className="size-3.5 text-muted-foreground/30" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.liveUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-between items-center h-16 px-8 rounded-2xl border border-border/30 bg-muted/10 hover:bg-muted/30 transition-all duration-300 group"
                      nativeButton={false}
                      render={
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      <span className="text-[15px] font-semibold text-foreground/80">
                        Website
                      </span>
                      <ChevronRight className="size-5 text-muted-foreground/40 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                  {project.github && (
                    <Button
                      variant="outline"
                      className="w-full justify-between items-center h-16 px-8 rounded-2xl border border-border/30 bg-muted/10 hover:bg-muted/30 transition-all duration-300 group"
                      nativeButton={false}
                      render={
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      <span className="text-[15px] font-semibold text-foreground/80">
                        Github
                      </span>
                      <Github className="size-5 text-muted-foreground/40 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Media */}
              <div className="flex flex-col gap-4">
                {project.video && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-4xl bg-zinc-900 shadow-2xl border border-border/10">
                    <video
                      src={project.video}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  </div>
                )}

                {project.images &&
                  project.images.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative aspect-video w-full overflow-hidden rounded-4xl "
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
                    <div className="relative aspect-video w-full overflow-hidden rounded-4xl bg-[#0c0c0e] shadow-2xl border border-border/10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.3)_0%,transparent_60%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.25)_0%,transparent_60%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.2)_0%,transparent_50%)]" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/50" />
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
