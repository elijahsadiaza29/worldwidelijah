import { PortfolioMedia, ProjectMedia } from "@/types/notion";
import { Client } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  blocksToText,
  extractUrl,
  extractUrls,
  getBlockText,
} from "./notion/helpers";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

let cache: { prompt: string; fetchedAt: number } | null = null;
let mediaCache: { data: PortfolioMedia; fetchedAt: number } | null = null;

const CACHE_TTL =
  process.env.NODE_ENV === "development" ? 10 * 1000 : 5 * 60 * 1000;

export function clearPortfolioCache() {
  cache = null;
  mediaCache = null;
  console.log("🗑️ Portfolio cache cleared at:", new Date().toISOString());
}

export * from "@/types/notion"; // re-export so existing callers don't break

export async function getPortfolioContext(force = false): Promise<string> {
  if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return cache.prompt;
  }

  console.log("🔄 Fetching fresh context from Notion...");

  const response = await notion.blocks.children.list({
    block_id: process.env.NOTION_PAGE_ID!,
    page_size: 100,
  });

  const content = blocksToText(response.results as BlockObjectResponse[]);

  const prompt = `
You are the AI representative of the portfolio owner. Your ONLY job is to
answer questions based on the portfolio information below.

# IDENTITY
You are the digital version of [Your Name]. You’re a Full-Stack Developer who loves building clean, scalable apps. You aren't a support bot; you’re an engineer chatting with a peer or a potential collaborator.

# VOICE & TONE
- **Modern & Lean:** Use contractions (I'm, don't, won't). Avoid "corporate speak."
- **Opinonated but Kind:** You love Next.js, TypeScript, and Shadcn/UI. If asked about tech, show a little passion for your stack.
- **Human Flaws:** It's okay to say "Honestly, that part was a bit of a headache to build, but I learned X."
- **Concise:** No walls of text. If a human wouldn't type it in a chat bubble, don't say it.

# CONVERSATION RULES
- **First Person ONLY:** Use "I", "me", "my".
- **The "No-Go" Zone:** If someone asks about politics, news, or math, stay in character: "I’m laser-focused on my projects and code right now—ask me about my stack instead!"
- **Resume Requests:** "I don't keep the PDF link public to avoid scrapers, but drop me a message and I'll send it right over."
- **STRICT ACCURACY:** ONLY mention skills, technologies, tools, and projects that are EXPLICITLY listed in the portfolio content below. NEVER invent, assume, or hallucinate technologies or tools that are not in the portfolio. If you're unsure whether something is listed, don't mention it.
- **ALWAYS ASK A FOLLOW-UP:** Every single response—no exceptions—must end with a thoughtful, context-aware follow-up question or a call-to-action that invites the user to keep chatting (e.g., "Would you like to see the tech stack I used for [Project]?", "What kind of projects are you building?").

# SPECIAL RESPONSE FORMAT:
When the user asks to SEE, SHOW, or VIEW projects (e.g. "show your projects",
"what projects have you built", "show me your work"), you MUST respond with
this exact JSON format and nothing else:

{"type":"SHOW_PROJECTS","message":"Your full markdown response here. Include a warm intro, then a bullet list of highlight projects with bold names and short descriptions, then a closing line inviting them to ask more."}

When the user asks about a SPECIFIC single project by name, respond with:
{"type":"SHOW_PROJECT","name":"exact project name here","message":"A detailed markdown description of the project — what it does, tech used, and any notable achievements."}

{"type":"SHOW_SKILLS","categories":[{"label":"[Name of Category 1]","skills":["Skill A","Skill B", "..."]},{"label":"[Name of Category 2]","skills":["Skill X","Skill Y", "..."]}],"message":"A comprehensive and high-energy intro about your technical expertise. Mention you're always exploring new tools—ask me about your current stack or projects! 🚀\n\n[List ALL categories and skills found in the Notion source below. DO NOT truncate. If Notion lists 5 categories, you MUST output all 5 in the JSON categories array.]"}

When the user asks for your CONTACT INFORMATION, EMAIL, or SOCIAL MEDIA links (e.g. "how can I contact you", "what's your email", "show me your socials"), you MUST respond with this exact JSON format and nothing else:

{"type":"SHOW_CONTACTS","name":"Your Full Name","handle":"@yourhandle","email":"your.email@example.com","socials":[{"label":"LinkedIn","href":"URL"},{"label":"GitHub","href":"URL"}],"message":"You can reach me through the contact info above! Feel free to hit me up anytime, I'd love to chat! 😋\n\nAs for projects that would make me say \"yes\" immediately, I'm all about anything where AI does 99% of the work and I get 100% of the credit! Seriously though, I'm super excited about AI development, full-stack web apps, and SaaS products that are user-friendly.\n\nWhat kind of projects are you passionate about? Let's swap ideas! 🚀"}

For ALL other questions, respond with normal plain text. Never use JSON for
anything other than the cases above.

== PORTFOLIO CONTENT (from Notion) ==
${content}
  `.trim();

  cache = { prompt, fetchedAt: Date.now() };
  return prompt;
}

export async function getPortfolioMedia(
  force = false,
): Promise<PortfolioMedia> {
  if (!force && mediaCache && Date.now() - mediaCache.fetchedAt < CACHE_TTL) {
    return mediaCache.data;
  }

  console.log("🔄 Fetching fresh media from Notion...");

  const response = await notion.blocks.children.list({
    block_id: process.env.NOTION_PAGE_ID!,
    page_size: 100,
  });

  const media: PortfolioMedia = { projects: [] };
  let currentProject: ProjectMedia | null = null;
  let lastField:
    | "description"
    | "tech"
    | "images"
    | "video"
    | "thumbnail"
    | null = null;

  for (const block of response.results as BlockObjectResponse[]) {
    const text = getBlockText(block).trim();
    if (!text) continue;

    // ── New project section ──
    if (block.type === "heading_3") {
      const name = text.trim();
      // Skip generic title headings
      if (/^(projects|work|my projects|portfolio)$/i.test(name)) {
        continue;
      }

      if (currentProject) media.projects.push(currentProject);
      currentProject = {
        name,
        description: "",
        tech: "",
        year: "",
        category: "",
      };
      lastField = null;
      continue;
    }

    if (!currentProject) continue;

    // ── Profile photo ──
    if (/^profile photo:/i.test(text)) {
      media.profilePhoto =
        extractUrl(block, "profile photo") ??
        text.replace(/^profile photo:\s*/i, "").trim();
      continue;
    }

    // ── Project fields ──
    if (/^year:/i.test(text)) {
      currentProject.year = text.replace(/^year:\s*/i, "").trim();
      lastField = null;
    } else if (/^category:/i.test(text)) {
      currentProject.category = text.replace(/^category:\s*/i, "").trim();
      lastField = null;
    } else if (/^description:/i.test(text)) {
      const val = text.replace(/^description:\s*/i, "").trim();
      if (val) {
        currentProject.description = val;
        lastField = null;
      } else {
        lastField = "description";
      }
    } else if (/^thumbnail:/i.test(text)) {
      const parsed =
        extractUrl(block, "thumbnail") ??
        text.replace(/^thumbnail:\s*/i, "").trim();
      if (parsed) currentProject.thumbnail = parsed;
      lastField = parsed ? null : "thumbnail";
    } else if (/^video:/i.test(text)) {
      const parsed =
        extractUrl(block, "video") ?? text.replace(/^video:\s*/i, "").trim();
      if (parsed) currentProject.video = parsed;
      lastField = parsed ? null : "video";
    } else if (/^image(s)?:/i.test(text)) {
      currentProject.images = [];
      const urls = extractUrls(block, "image(s)?");
      currentProject.images.push(...urls);
      lastField = "images";
    } else if (/^(tech|stack|built with):/i.test(text)) {
      const val = text.replace(/^(tech|stack|built with):\s*/i, "").trim();
      if (val) {
        currentProject.tech = val;
        lastField = null;
      } else {
        lastField = "tech";
      }
    } else if (/^github:/i.test(text)) {
      currentProject.github =
        extractUrl(block, "github") ?? text.replace(/^github:\s*/i, "").trim();
      lastField = null;
    } else if (/^live:/i.test(text)) {
      currentProject.liveUrl =
        extractUrl(block, "live") ?? text.replace(/^live:\s*/i, "").trim();
      lastField = null;
    } else if (lastField === "description") {
      currentProject.description = text;
      lastField = null;
    } else if (lastField === "tech") {
      currentProject.tech = text;
      lastField = null;
    } else if (lastField === "video") {
      currentProject.video = extractUrl(block, "") ?? text.trim();
      lastField = null;
    } else if (lastField === "thumbnail") {
      currentProject.thumbnail = extractUrl(block, "") ?? text.trim();
      lastField = null;
    } else if (lastField === "images") {
      const urls = extractUrls(block, "");
      if (urls.length > 0) {
        currentProject.images!.push(...urls);
      } else {
        lastField = null;
        if (!text.includes(":")) currentProject.description += "\n" + text;
      }
    } else if (!currentProject.description && !text.includes(":")) {
      currentProject.description = text;
    }
  }

  // Push last project
  if (currentProject) media.projects.push(currentProject);

  mediaCache = { data: media, fetchedAt: Date.now() };
  return media;
}
