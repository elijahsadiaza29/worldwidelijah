"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import prism from "react-syntax-highlighter/dist/esm/prism";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "relative my-4 overflow-hidden rounded-lg bg-zinc-950 text-zinc-50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CodeBlockCodeProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
}

function CodeBlockCode({
  code,
  language,
  className,
  ...props
}: CodeBlockCodeProps) {
  return (
    <div className="relative">
      <SyntaxHighlighter
        language={language || "text"}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={prism as any}
        customStyle={
          {
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5rem",
            background: "transparent",
          } as React.CSSProperties
        }
        codeTagProps={{
          style: {
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          },
        }}
        className={cn("font-mono !bg-transparent", className)}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export { CodeBlock, CodeBlockCode };
