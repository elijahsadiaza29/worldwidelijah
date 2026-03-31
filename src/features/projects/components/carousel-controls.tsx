"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export function CarouselControls({
  onPrev,
  onNext,
  canPrev,
  canNext,
}: CarouselControlsProps) {
  return (
    <div className="flex justify-end gap-2 pr-0.5">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="flex h-9 w-9 items-center justify-center rounded-full
                   border border-border/60 bg-background/80
                   hover:bg-muted hover:border-border
                   transition-all duration-150
                   disabled:opacity-25 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="flex h-9 w-9 items-center justify-center rounded-full
                   border border-border/60 bg-background/80
                   hover:bg-muted hover:border-border
                   transition-all duration-150
                   disabled:opacity-25 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
