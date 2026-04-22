"use client";

import type { ProjectMedia } from "@/lib/getPortfolioContext";
import { MessageType } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useEffect, useState } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { WelcomeScreen } from "./welcome-screen";
import { useRateLimit } from "@/hooks/use-rate-limit";

type LayoutState = "welcome" | "chat";

export default function ChatContainer() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [layoutState, setLayoutState] = useState<LayoutState>("welcome");
  const [projects, setProjects] = useState<ProjectMedia[]>([]);

  const rateLimit = useRateLimit();

  const isWelcome = layoutState === "welcome";

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/portfolio-media");

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          console.error("portfolio-media API returned non-JSON:", res.status);
          return;
        }

        const data = await res.json();
        setProjects(data.projects ?? []);
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    }
    loadProjects();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (isWelcome) setLayoutState("chat");

    const originalInput = text;
    setInputValue("");
    setIsLoading(true);

    if (rateLimit.isLimited) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev, 
          { id: Date.now().toString(), role: "user", content: text },
          { id: (Date.now() + 1).toString(), role: "assistant", content: "I'm currently resting! You've used all your allocated demo tokens. Please wait until the timer resets." }
        ]);
        setIsLoading(false);
      }, 600);
      return;
    }

    rateLimit.incrementMessage();

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantPlaceholder: MessageType = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      markdown: true,
    };

    // Show messages immediately (Optimistic UI for visibility)
    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content:
              typeof m.content === "string" ? m.content : "Portfolio Section",
          })),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: errorText || "Sorry, I encountered an error. Please try again." }
              : m,
          ),
        );
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let accumulatedContent = "";
      const decoder = new TextDecoder();
      let isJsonStream = false;
      let streamEvaluated = false;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          if (isJsonStream) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: accumulatedContent }
                  : m,
              ),
            );
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        if (!streamEvaluated && accumulatedContent.length > 5) {
          const trimmed = accumulatedContent.trimStart();
          // Improved detection: Check if it looks like a JSON widget anywhere in the early stream
          if (
            trimmed.startsWith("{") || 
            trimmed.startsWith("```json") || 
            trimmed.includes('"type": "SHOW_') ||
            trimmed.includes('"type":"SHOW_')
          ) {
            isJsonStream = true;
          }
          streamEvaluated = true;
        }

        if (streamEvaluated && !isJsonStream) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: accumulatedContent }
                : m,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setInputValue(originalInput); 

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content: "Sorry, I encountered an error. Please try again.",
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopy = (text: string) => navigator.clipboard.writeText(text);
  const handleLike = (id: string, liked: boolean) =>
    console.log(`Message ${id} liked: ${liked}`);

  return (
    <div className="flex h-screen flex-col overflow-hidden w-full bg-white dark:bg-background text-foreground">
      <main className="relative flex-1 flex flex-col w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {isWelcome ? (
            <div
              key="welcome"
              className="flex flex-1 flex-col items-center justify-center p-4 min-h-full"
            >
              <div className="w-full max-w-3xl flex flex-col items-center justify-center space-y-8">
                <WelcomeScreen />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="w-full flex justify-center"
                >
                  <ChatInput
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    isLoading={isLoading}
                    onSend={handleSend}
                    rateLimit={rateLimit}
                  />
                </motion.div>
              </div>
            </div>
          ) : (
            <div
              key="chat"
              className="flex flex-grow flex-col w-full h-full relative overflow-hidden"
            >
              <ChatMessages
                messages={messages}
                onCopy={handleCopy}
                onLike={handleLike}
                projects={projects}
              />

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-0 left-0 right-0 z-20 flex flex-col items-center"
              >
                <ChatInput
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  isLoading={isLoading}
                  onSend={handleSend}
                  rateLimit={rateLimit}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
