"use client";

import { cn } from "@/lib/utils";
import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { CodeBlock, CodeBlockCode } from "./code-block";

export type MarkdownProps = {
  children: string;
  id?: string;
  className?: string;
  components?: Partial<Components>;
};

function extractLanguage(className?: string): string {
  if (!className) return "plaintext";
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "plaintext";
}

const INITIAL_COMPONENTS: Partial<Components> = {
  code: function CodeComponent({
    className,
    children,
    inline,
    ...props
  }: {
    className?: string;
    children?: React.ReactNode;
    inline?: boolean;
  }) {
    if (inline) {
      return (
        <span
          className={cn(
            "bg-muted rounded-sm px-1 py-0.5 font-mono text-sm",
            className,
          )}
          {...props}
        >
          {children}
        </span>
      );
    }
    const language = extractLanguage(className);
    return (
      <CodeBlock className={className}>
        <CodeBlockCode code={children as string} language={language} />
      </CodeBlock>
    );
  },
  p: ({ children }: { children?: React.ReactNode }) => (
    <div className="mb-4 last:mb-0 leading-relaxed">{children}</div>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
};

const MemoizedMarkdown = memo(
  function MarkdownBlock({
    children,
    className,
    components = INITIAL_COMPONENTS,
  }: MarkdownProps) {
    return (
      <div className={className}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={components}
        >
          {children}
        </ReactMarkdown>
      </div>
    );
  },
  (prev, next) =>
    prev.children === next.children && prev.className === next.className,
);

export { MemoizedMarkdown as Markdown };
