"use client";

import { Loader } from "@/components/ui/loader";

export function ThinkingIndicator() {
  return (
    <div className="flex items-center">
      <Loader variant="text-shimmer" size="md" />
    </div>
  );
}
