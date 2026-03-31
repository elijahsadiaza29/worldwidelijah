"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Markdown } from "./markdown";

export type MessageProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const Message = ({ children, className, ...props }: MessageProps) => (
  <div className={cn("flex gap-4 px-4 py-8", className)} {...props}>
    {children}
  </div>
);

export type MessageAvatarProps = {
  src: string;
  alt: string;
  fallback?: string;
  delayMs?: number;
  className?: string;
};

const MessageAvatar = ({
  src,
  alt,
  fallback,
  delayMs,
  className,
}: MessageAvatarProps) => {
  return (
    <Avatar className={cn("h-9 w-9 shrink-0", className)}>
      <AvatarImage src={src} alt={alt} />
      {fallback && (
        <AvatarFallback
          delayMs={delayMs}
          className="bg-primary text-primary-foreground text-xs font-bold leading-none"
        >
          {fallback}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export type MessageContentProps = {
  children: React.ReactNode;
  markdown?: boolean;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageContent = ({
  children,
  markdown = false,
  className,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    "flex-1 space-y-2 text-[15px] leading-relaxed text-foreground/90",
    "prose prose-neutral dark:prose-invert max-w-none break-words",
    className,
  );

  if (markdown && typeof children === "string") {
    return (
      <Markdown className={classNames} {...props}>
        {children}
      </Markdown>
    );
  }

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

const MessageActions = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-2 flex items-center gap-1 text-muted-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

const MessageAction = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
} & React.ComponentProps<typeof Tooltip>) => (
  <TooltipProvider>
    <Tooltip {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        className={cn("px-2 py-1 text-[11px]", className)}
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
};
