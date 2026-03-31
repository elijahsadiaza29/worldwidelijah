"use client";

import {
  Briefcase,
  Layers,
  MoreHorizontal,
  PartyPopper,
  Search,
  Smile,
} from "lucide-react";
import { PromptSuggestion } from "../ui/prompt-suggestion";

interface SuggestionsRowProps {
  onSuggestionClick: (text: string) => void;
  onMoreClick: () => void;
}

export function SuggestionsRow({
  onSuggestionClick,
  onMoreClick,
}: SuggestionsRowProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PromptSuggestion
        onClick={() => onSuggestionClick("Tell me about yourself")}
        className="gap-2"
      >
        <Smile size={16} />
        Me
      </PromptSuggestion>
      <PromptSuggestion
        onClick={() => onSuggestionClick("Show me your projects")}
        className="gap-2"
      >
        <Briefcase size={16} />
        Projects
      </PromptSuggestion>
      <PromptSuggestion
        onClick={() => onSuggestionClick("What are your core skills?")}
        className="gap-2"
      >
        <Layers size={16} />
        Skills
      </PromptSuggestion>
      <PromptSuggestion
        onClick={() =>
          onSuggestionClick("Tell me something fun or interesting")
        }
        className="gap-2"
      >
        <PartyPopper size={16} />
        Fun
      </PromptSuggestion>
      <PromptSuggestion
        onClick={() => onSuggestionClick("How can I contact you?")}
        className="gap-2"
      >
        <Search size={16} />
        Contact
      </PromptSuggestion>
      <PromptSuggestion
        onClick={onMoreClick}
        className="size-9 p-0 rounded-full"
      >
        <MoreHorizontal size={18} />
      </PromptSuggestion>
    </div>
  );
}
