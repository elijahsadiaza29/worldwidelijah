"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { SUGGESTION_CATEGORIES } from "./suggestions-data";

interface SuggestionsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuggestionClick: (text: string) => void;
}

export function SuggestionsDrawer({
  open,
  onOpenChange,
  onSuggestionClick,
}: SuggestionsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[75vh] !rounded-t-[32px] overflow-hidden border-t-0">
        <div className="mx-auto w-full max-w-2xl px-4">
          <DrawerHeader className="px-0 pb-2">
            <DrawerTitle className="sr-only flex items-center gap-2 text-xl font-bold">
              Quick Questions
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea
            className="h-[calc(55vh-80px)] sm:h-[calc(75vh-80px)]"
            hideScrollbar
          >
            <div className="flex flex-col gap-8 py-4">
              {SUGGESTION_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900">
                      {cat.icon}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {cat.category}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {cat.items.map((item, iIdx) => (
                      <button
                        key={iIdx}
                        onClick={() => onSuggestionClick(item.text)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl p-4 text-left",
                          item.highlighted
                            ? "bg-zinc-950 text-white dark:bg-white dark:text-black shadow-lg shadow-zinc-200/50 dark:shadow-none"
                            : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <div
                              className={cn(
                                "flex items-center justify-center",
                                item.highlighted
                                  ? "text-white dark:text-black"
                                  : "text-zinc-500",
                              )}
                            >
                              {item.icon}
                            </div>
                          )}
                          <span className="text-sm font-medium tracking-tight">
                            {item.text}
                          </span>
                        </div>
                        <ChevronRight
                          size={16}
                          className={cn(
                            item.highlighted
                              ? "text-zinc-400"
                              : "text-zinc-300 dark:text-zinc-600",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
