"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp, ChevronDown, ChevronUp, Mic, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PromptInput, PromptInputTextarea } from "../ui/prompt-input";
import { SuggestionsDrawer } from "./suggestions-drawer";
import { SuggestionsRow } from "./suggestions-row";
import { useRateLimit } from "@/hooks/use-rate-limit";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  onSend: (text: string) => void;
  showSuggestions?: boolean;
  className?: string;
  rateLimit?: ReturnType<typeof useRateLimit>;
}

export function ChatInput({
  inputValue,
  setInputValue,
  isLoading,
  onSend,
  showSuggestions = true,
  className,
  rateLimit,
}: ChatInputProps) {
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateState = () => {
    const el = textareaRef.current;
    if (!el) return;
    const overflow = el.scrollHeight > el.clientHeight;
    const atTop = el.scrollTop === 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setIsOverflowing(overflow);
    setShowTopGradient(overflow && !atTop);
    setShowBottomGradient(overflow && !atBottom);
  };

  useEffect(() => {
    updateState();
  }, [inputValue]);

  const handleSuggestionClick = (text: string) => {
    onSend(text);
    setIsSuggestionsVisible(false);
    setIsDrawerOpen(false);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl px-3 md:px-5 flex flex-col gap-3",
        "bg-background pt-4 pb-6 rounded-t-3xl",
        className,
      )}
    >
      {/* Top transition gradient */}
      <div className="absolute top-[-20px] left-0 right-0 h-[20px] bg-gradient-to-t from-white to-transparent dark:from-zinc-950 pointer-events-none" />
      {/* Bottom filler to cover padding area */}
      <div className="absolute bottom-[-100px] left-0 right-0 h-[100px] bg-background" />
      {showSuggestions && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSuggestionsVisible(!isSuggestionsVisible)}
              className="h-auto py-1 px-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-1.5 text-xs font-medium transition-colors"
            >
              {isSuggestionsVisible ? (
                <ChevronDown size={14} className="opacity-70" />
              ) : (
                <ChevronUp size={14} className="opacity-70" />
              )}
              {isSuggestionsVisible
                ? "Hide quick questions"
                : "Show quick questions"}
            </Button>
          </div>

          {isSuggestionsVisible && (
            <div
              className={cn(
                isLoading &&
                  "opacity-50 pointer-events-none transition-opacity",
              )}
            >
              <SuggestionsRow
                onSuggestionClick={handleSuggestionClick}
                onMoreClick={() => setIsDrawerOpen(true)}
              />
            </div>
          )}
        </div>
      )}

      <SuggestionsDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSuggestionClick={handleSuggestionClick}
      />

      <PromptInput
        isLoading={isLoading}
        value={inputValue}
        onValueChange={setInputValue}
        onSubmit={() => {
          onSend(inputValue);
        }}
        className={cn(
          "flex w-full overflow-hidden rounded-[26px]",
          "bg-muted border-none",
          "px-2 py-2 gap-1 transition-all",
          "[&>div]:bg-transparent [&_textarea]:bg-transparent",
          isOverflowing ? "flex-col" : "flex-row items-end",
        )}
      >
        {isOverflowing ? (
          <>
            <div className="relative w-full">
              <PromptInputTextarea
                ref={textareaRef}
                placeholder="Ask anything"
                onScroll={updateState}
                className="
                  min-h-[36px] max-h-[200px] w-full resize-none
                  py-[7px] px-1 text-base leading-[1.5]
                  bg-transparent dark:bg-transparent focus:outline-none overflow-y-auto
                  [&::-webkit-scrollbar]:w-[5px]
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-zinc-300
                  dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600
                  [&::-webkit-scrollbar-thumb:hover]:bg-zinc-400
                  dark:[&::-webkit-scrollbar-thumb:hover]:bg-zinc-500
                "
              />
              <div
                className={cn(
                  "pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-muted dark:from-muted to-transparent transition-opacity duration-150",
                  showTopGradient ? "opacity-100" : "opacity-0",
                )}
                aria-hidden="true"
              />
              <div
                className={cn(
                  "pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-muted dark:from-muted to-transparent transition-opacity duration-150",
                  showBottomGradient ? "opacity-100" : "opacity-0",
                )}
                aria-hidden="true"
              />
            </div>

            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-zinc-500 hover:bg-black/10 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100"
              >
                <Plus size={18} className="stroke-[2.5]" />
              </Button>
              <Button
                size="icon"
                onClick={() => onSend(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="size-9 flex items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-opacity"
              >
                {!isLoading ? (
                  <ArrowUp size={20} strokeWidth={2.5} />
                ) : (
                  <span className="size-3 animate-pulse rounded-sm bg-current" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 size-9 self-end rounded-full text-zinc-500 hover:bg-black/10 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100"
            >
              <Plus size={18} className="stroke-[2.5]" />
            </Button>

            <div className="relative flex-1 min-w-0">
              <PromptInputTextarea
                ref={textareaRef}
                placeholder="Ask anything"
                onScroll={updateState}
                className="
                  min-h-[36px] max-h-[200px] w-full resize-none
                  py-[7px] px-1 text-base leading-[1.5]
                  bg-transparent dark:bg-transparent focus:outline-none overflow-y-auto
                  [&::-webkit-scrollbar]:w-[5px]
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-zinc-300
                  dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600
                  [&::-webkit-scrollbar-thumb:hover]:bg-zinc-400
                  dark:[&::-webkit-scrollbar-thumb:hover]:bg-zinc-500
                "
              />
            </div>

            {!inputValue.trim() && !isLoading ? (
              <Button
                variant="ghost"
                className="shrink-0 self-end flex h-9 items-center gap-2 rounded-full bg-black/5 px-3 text-sm font-medium text-zinc-600 hover:bg-black/10 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15"
              >
                <Mic size={18} strokeWidth={2} />
                Voice
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={() => onSend(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="shrink-0 self-end size-9 flex items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-opacity"
              >
                {!isLoading ? (
                  <ArrowUp size={20} strokeWidth={2.5} />
                ) : (
                  <span className="size-3 animate-pulse rounded-sm bg-current" />
                )}
              </Button>
            )}
          </>
        )}
      </PromptInput>

      {/* Cursor-style Rate Limit Status UI */}
      {rateLimit && (
        <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium px-3 mt-1 pb-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span>Session: {Math.round((rateLimit.messagesLeft / rateLimit.maxMessages) * 100)}%</span>
            <div className="h-1.5 w-16 sm:w-24 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-500", rateLimit.messagesLeft <= 3 ? "bg-red-500" : "bg-blue-500")} 
                style={{ width: `${(rateLimit.messagesLeft / rateLimit.maxMessages) * 100}%` }} 
              />
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            {rateLimit.resetAt && rateLimit.messagesLeft < rateLimit.maxMessages ? (
              <span className="hidden sm:inline">
                Reset in: {rateLimit.resetAt > Date.now() 
                  ? `${Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 60000))}m` 
                  : "Refreshing"}
              </span>
            ) : null}
            <span>Messages left: {(rateLimit.messagesLeft).toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
