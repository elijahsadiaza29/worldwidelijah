"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentClassName?: string;
  snapPoints?: (number | string)[];
}

const ResponsiveModalContext = React.createContext<{ isDesktop: boolean }>({
  isDesktop: true,
});

export function ResponsiveModal({
  children,
  open,
  onOpenChange,
  contentClassName,
  snapPoints = [0.85, 1],
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <ResponsiveModalContext.Provider value={{ isDesktop }}>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className={cn("p-0 overflow-hidden border-none", contentClassName)}
            initialFocus={false}
          >
            {children}
          </DialogContent>
        </Dialog>
      </ResponsiveModalContext.Provider>
    );
  }

  return (
    <ResponsiveModalContext.Provider value={{ isDesktop }}>
      <Drawer open={open} onOpenChange={onOpenChange} snapPoints={snapPoints}>
        <DrawerContent
          className={cn(
            "p-0 overflow-hidden border-none bg-background focus-visible:outline-none focus:outline-none flex flex-col [&>div:first-child]:bg-muted-foreground/20 [&>div:first-child]:mb-4",
            contentClassName,
          )}
        >
          {children}
        </DrawerContent>
      </Drawer>
    </ResponsiveModalContext.Provider>
  );
}

export function ResponsiveModalTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { isDesktop } = React.useContext(ResponsiveModalContext);

  if (isDesktop) {
    return <DialogTitle className={className}>{children}</DialogTitle>;
  }

  return <DrawerTitle className={className}>{children}</DrawerTitle>;
}

export function ResponsiveModalScrollArea({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { isDesktop } = React.useContext(ResponsiveModalContext);

  if (isDesktop) {
    return <ScrollArea className={className}>{children}</ScrollArea>;
  }

  return (
    <div 
      className={cn("overflow-y-auto overflow-x-hidden", className)}
      data-vaul-scrollable="true"
    >
      {children}
    </div>
  );
}
