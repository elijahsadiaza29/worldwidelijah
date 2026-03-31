"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
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
      <DrawerContent className="max-h-[75vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="sr-only">Quick Questions</DrawerTitle>
          </DrawerHeader>

          <ScrollArea className="h-[55vh] px-4 pb-6">
            <div className="flex flex-col gap-6">
              {SUGGESTION_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  {/* Category header */}
                  <div className="flex items-center gap-2 px-2 py-1 mb-1">
                    <span className="text-muted-foreground">{cat.icon}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {cat.category}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col rounded-lg border bg-card overflow-hidden">
                    {cat.items.map((item, iIdx) => (
                      <div key={iIdx}>
                        <button
                          onClick={() => onSuggestionClick(item.text)}
                          className={cn(
                            "flex w-full items-center justify-between px-4 py-3 text-left",
                            "text-sm text-foreground",
                            "hover:bg-accent hover:text-accent-foreground transition-colors",
                            item.highlighted && "font-medium",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && (
                              <span className="text-muted-foreground shrink-0">
                                {item.icon}
                              </span>
                            )}
                            <span>{item.text}</span>
                          </div>
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-muted-foreground"
                          />
                        </button>
                        {iIdx < cat.items.length - 1 && <Separator />}
                      </div>
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
