"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export interface PromptSuggestionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PromptSuggestion({
  children,
  className,
  ...props
}: PromptSuggestionProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border/40 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 dark:border-border/40 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted/80 dark:hover:text-foreground dark:focus-visible:ring-border",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
