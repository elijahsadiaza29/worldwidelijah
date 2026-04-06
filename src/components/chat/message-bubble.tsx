"use client";

import CloudinaryMedia from "@/components/shared/cloudinary-media";
import { Button } from "@/components/ui/button";
import ChatWidgetRenderer from "@/features/projects/components/chat-widget-renderer";
import type { ProjectMedia } from "@/lib/getPortfolioContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "../ui/message";

import { useVideoIntersection } from "@/hooks/use-video-intersection";
import { ThinkingIndicator } from "./thinking-indicator";

interface MessageBubbleProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string | React.ReactNode;
    markdown?: boolean;
  };
  onCopy?: (text: string) => void;
  onLike?: (id: string, liked: boolean) => void;
  index: number;
  projects?: ProjectMedia[];
}

type ContentPart =
  | { type: "text"; content: string }
  | { type: "image"; content: string }
  | { type: "video"; content: string };

function parseContent(text: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const mediaRegex = /(https:\/\/res\.cloudinary\.com\/[^\s\)]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = mediaRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index).trim();
      if (before) parts.push({ type: "text", content: before });
    }
    const url = match[1];
    const isVideo =
      url.includes("/video/upload/") || /\.(mp4|webm|mov)(\?|$)/i.test(url);
    parts.push({ type: isVideo ? "video" : "image", content: url });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).trim();
    if (remaining) parts.push({ type: "text", content: remaining });
  }

  if (parts.length === 0) parts.push({ type: "text", content: text });
  return parts;
}

export function MessageBubble({
  message,
  onCopy,
  onLike,
  index,
  projects = [],
}: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";
  const isString = typeof message.content === "string";
  const contentStr = isString ? (message.content as string) : "";
  const isEmpty = isString && contentStr.trim() === "";

  // Check if it's a widget JSON response first
  const isWidget =
    isString &&
    (contentStr.includes("SHOW_PROJECTS") ||
      contentStr.includes("SHOW_PROJECT") ||
      contentStr.includes("SHOW_SKILLS") ||
      contentStr.includes("SHOW_CONTACTS")) &&
    contentStr.includes('"type"');

  // Otherwise parse for Cloudinary URLs
  const parts =
    !isWidget && isString && !isEmpty ? parseContent(contentStr) : null;
  const hasMedia = parts?.some((p) => p.type !== "text");

  const videoRef = useVideoIntersection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Message
        className={cn(
          "mx-auto w-full max-w-3xl px-0 sm:px-4 gap-2",
          isAssistant ? "justify-start" : "justify-end",
        )}
      >
        {isAssistant && (
          <div className="hidden sm:block h-12 w-12 shrink-0 rounded-full overflow-hidden">
            <video
              ref={videoRef}
              src="https://res.cloudinary.com/dlhfnz7ro/video/upload/v1774943790/final_memojis_ix6rvh.webm"
              // autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-[1.6] mt-1.5"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 w-full ">
          {isAssistant ? (
            <MessageContent className="flex flex-col gap-1 max-w-2xl ">
              {isEmpty ? (
                <div className=" rounded-2xl w-fit">
                  <ThinkingIndicator />
                </div>
              ) : isWidget ? (
                <ChatWidgetRenderer content={contentStr} projects={projects} />
              ) : hasMedia && parts ? (
                <div className="flex flex-col gap-2 ">
                  {parts.map((part, i) => {
                    if (part.type === "image") {
                      return (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden
                                                border border-border/40 max-w-sm"
                        >
                          <CloudinaryMedia
                            url={part.content}
                            type="image"
                            alt="Project screenshot"
                            className="w-full object-cover max-h-60"
                          />
                        </div>
                      );
                    }
                    if (part.type === "video") {
                      return (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden
                                                border border-border/40 max-w-sm"
                        >
                          <CloudinaryMedia
                            url={part.content}
                            type="video"
                            className="w-full max-h-60"
                          />
                        </div>
                      );
                    }
                    return (
                      <MessageContent
                        key={i}
                        markdown={message.markdown}
                        className="text-foreground prose prose-a:text-primary
                                   bg-transparent px-0 py-2 w-fit max-w-2xl overflow-hidden"
                      >
                        {part.content}
                      </MessageContent>
                    );
                  })}
                </div>
              ) : (
                <MessageContent
                  markdown={message.markdown}
                  className="text-foreground prose prose-a:text-primary
                             bg-transparent px-0 py-2 w-fit max-w-2xl overflow-hidden"
                >
                  {message.content}
                </MessageContent>
              )}

              {/* Actions — only shown when assistant has replied */}
              {!isEmpty && (
                <MessageActions className="self-end">
                  <MessageAction tooltip="Copy to clipboard">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => {
                        if (isString) onCopy?.(contentStr);
                      }}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </MessageAction>
                  <MessageAction tooltip="Helpful">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => onLike?.(message.id, true)}
                    >
                      <ThumbsUp className="size-4" />
                    </Button>
                  </MessageAction>
                  <MessageAction tooltip="Not helpful">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => onLike?.(message.id, false)}
                    >
                      <ThumbsDown className="size-4" />
                    </Button>
                  </MessageAction>
                </MessageActions>
              )}
            </MessageContent>
          ) : (
            <div className="w-fit max-w-[350px] sm:max-w-lg ml-auto sm:mr-2">
              <MessageContent className="bg-muted text-foreground border border-border/40 rounded-3xl rounded-br-sm px-5 py-2 ">
                {message.content}
              </MessageContent>
            </div>
          )}
        </div>
      </Message>
    </motion.div>
  );
}
