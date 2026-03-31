"use client";

import { ProjectMedia } from "@/lib/getPortfolioContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";
import { StickToBottom } from "use-stick-to-bottom";
import { MessageBubble } from "./message-bubble";

// Removed unused MessageType interface

interface ChatMessagesProps {
  messages: {
    id: string;
    role: "user" | "assistant";
    content: string | React.ReactNode;
    markdown?: boolean;
  }[];
  onCopy?: (text: string) => void;
  onLike?: (id: string, liked: boolean) => void;
  projects?: ProjectMedia[];
}

function ChatContainerRoot({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <StickToBottom
      className={cn("flex flex-1 flex-col w-full", className)}
      role="log"
      {...props}
    >
      {children}
    </StickToBottom>
  );
}

function ChatContainerContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <StickToBottom.Content
      className={cn("flex w-full flex-col max-w-4xl mx-auto", className)}
      {...props}
    >
      {children}
    </StickToBottom.Content>
  );
}

function ChatContainerScrollAnchor({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-px w-full", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function ChatMessages({
  messages,
  onCopy,
  onLike,
  projects = [],
}: ChatMessagesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex-grow w-full relative h-[calc(100vh-140px)]"
    >
      <ChatContainerRoot className="h-full w-full overflow-y-auto">
        <ChatContainerContent className="p-4 pb-52">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={onCopy}
              onLike={onLike}
              index={index}
              projects={projects}
            />
          ))}
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>
    </motion.div>
  );
}
