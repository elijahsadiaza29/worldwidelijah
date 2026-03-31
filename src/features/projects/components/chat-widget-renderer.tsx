"use client";

import { MessageContent } from "@/components/ui/message";
import ProjectCarousel from "@/features/projects/components/project-carousel";
import ContactsWidget from "@/features/contact/components/contacts-widget";
import SkillsWidget from "@/features/skills/components/skills-widget";
import type { ProjectMedia } from "@/lib/getPortfolioContext";

interface ChatWidgetRendererProps {
  content: string;
  projects: ProjectMedia[];
}

type AIWidget =
  | { type: "SHOW_PROJECTS"; message: string }
  | { type: "SHOW_PROJECT"; name: string; message: string }
  | {
      type: "SHOW_SKILLS";
      message: string;
      categories: { label: string; skills: string[] }[];
    }
  | {
      type: "SHOW_CONTACTS";
      message: string;
      name: string;
      handle: string;
      email: string;
      socials: { label: string; href: string }[];
    };

function tryParseWidget(content: string): AIWidget | null {
  try {
    // 1. Direct JSON parse attempt (cleanest case)
    let cleaned = content
      .trim()
      .replace(/^```json\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    const startIdx = cleaned.indexOf("{");
    const endIdx = cleaned.lastIndexOf("}");

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const potentialJson = cleaned.slice(startIdx, endIdx + 1);
      try {
        const parsed = JSON.parse(potentialJson);
        if (isWidgetType(parsed)) return parsed as AIWidget;
      } catch {
        // 2. Regex-based field extraction (handles literal newlines and unescaped quotes)
        const typeMatch = potentialJson.match(
          /"type"\s*:\s*"(SHOW_(?:PROJECTS|PROJECT|SKILLS|CONTACTS))"/,
        );
        if (typeMatch) {
          const type = typeMatch[1] as AIWidget["type"];

          // Extract message
          const msgMatch = potentialJson.match(
            /"message"\s*:\s*"([\s\S]*?)"\s*(?:,|\})/,
          );
          const message = msgMatch ? msgMatch[1] : "";

          if (type === "SHOW_CONTACTS") {
            const handleMatch = potentialJson.match(/"handle"\s*:\s*"([^"]*)"/);
            const emailMatch = potentialJson.match(/"email"\s*:\s*"([^"]*)"/);
            const nameMatch = potentialJson.match(/"name"\s*:\s*"([^"]*)"/);

            // Simple regex for socials array
            const socialsMatch = potentialJson.match(/"socials"\s*:\s*(\[[\s\S]*?\])/);
            let socials = [];
            if (socialsMatch) {
              try {
                socials = JSON.parse(socialsMatch[1].replace(/\n/g, ""));
              } catch {
                socials = [];
              }
            }

            return {
              type,
              message,
              name: nameMatch ? nameMatch[1] : "",
              handle: handleMatch ? handleMatch[1] : "",
              email: emailMatch ? emailMatch[1] : "",
              socials,
            } as AIWidget;
          }

          if (type === "SHOW_SKILLS") {
            const catsMatch = potentialJson.match(
              /"categories"\s*:\s*(\[[\s\S]*?\])/,
            );
            let categories = [];
            if (catsMatch) {
              try {
                categories = JSON.parse(catsMatch[1].replace(/\n/g, ""));
              } catch {
                categories = [];
              }
            }
            return { type, message, categories } as AIWidget;
          }

          if (type === "SHOW_PROJECT") {
            const nameMatch = potentialJson.match(/"name"\s*:\s*"([^"]*)"/);
            return {
              type,
              message,
              name: nameMatch ? nameMatch[1] : "",
            } as AIWidget;
          }

          return { type, message } as AIWidget;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

function isWidgetType(obj: Record<string, unknown>): boolean {
  return (
    obj.type === "SHOW_PROJECTS" ||
    obj.type === "SHOW_PROJECT" ||
    obj.type === "SHOW_SKILLS" ||
    obj.type === "SHOW_CONTACTS"
  );
}

export default function ChatWidgetRenderer({
  content,
  projects,
}: ChatWidgetRendererProps) {
  const widget = tryParseWidget(content);

  if (!widget) {
    return (
      <MessageContent markdown className="text-foreground">
        {content}
      </MessageContent>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Projects widgets */}
      {(widget.type === "SHOW_PROJECTS" || widget.type === "SHOW_PROJECT") && (
        <ProjectCarousel
          projects={projects}
          highlightName={
            widget.type === "SHOW_PROJECT" ? widget.name : undefined
          }
        />
      )}

      {/* Skills widget */}
      {widget.type === "SHOW_SKILLS" && (
        <SkillsWidget categories={widget.categories} />
      )}

      {/* Contacts widget */}
      {widget.type === "SHOW_CONTACTS" && (
        <ContactsWidget
          name={widget.name}
          handle={widget.handle}
          email={widget.email}
          socials={widget.socials}
        />
      )}

      {widget.message && (
        <MessageContent
          markdown={true}
          className="text-foreground prose prose-a:text-primary rounded-lg p-0 py-2"
        >
          {widget.message}
        </MessageContent>
      )}
    </div>
  );
}
