import {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export function richText(arr: RichTextItemResponse[]): string {
  return arr.map((t) => t.plain_text).join("");
}

export function getBlockText(block: BlockObjectResponse): string {
  switch (block.type) {
    case "heading_1":
      return richText(block.heading_1.rich_text);
    case "heading_2":
      return richText(block.heading_2.rich_text);
    case "heading_3":
      return richText(block.heading_3.rich_text);
    case "paragraph":
      return richText(block.paragraph.rich_text);
    case "bulleted_list_item":
      return richText(block.bulleted_list_item.rich_text);
    case "numbered_list_item":
      return richText(block.numbered_list_item.rich_text);
    default:
      return "";
  }
}

export function blocksToText(blocks: BlockObjectResponse[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading_1":
          return `\n== ${richText(block.heading_1.rich_text)} ==\n`;
        case "heading_2":
          return `\n-- ${richText(block.heading_2.rich_text)} --\n`;
        case "heading_3":
          return `\n${richText(block.heading_3.rich_text)}:`;
        case "paragraph":
          return richText(block.paragraph.rich_text);
        case "bulleted_list_item":
          return `• ${richText(block.bulleted_list_item.rich_text)}`;
        case "numbered_list_item":
          return `- ${richText(block.numbered_list_item.rich_text)}`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

export function extractUrl(
  block: BlockObjectResponse,
  prefix: string,
): string | undefined {
  let richTextArr: RichTextItemResponse[] = [];

  if (block.type === "paragraph") {
    richTextArr = block.paragraph.rich_text;
  } else if (block.type === "bulleted_list_item") {
    richTextArr = block.bulleted_list_item.rich_text;
  }

  if (richTextArr.length === 0) return undefined;

  // Get the full plain text
  const fullText = richTextArr.map((t) => t.plain_text).join("");

  // Remove the prefix (e.g. "Thumbnail: ")
  const afterPrefix = fullText
    .replace(new RegExp(`^${prefix}:\\s*`, "i"), "")
    .trim();

  // If Notion auto-linked the URL, grab href from the link object
  for (const segment of richTextArr) {
    // Check inline link href
    if (segment.href && segment.href.startsWith("http")) {
      return segment.href.trim();
    }
    // Check text annotation link
    if (
      segment.type === "text" &&
      segment.text?.link?.url &&
      segment.text.link.url.startsWith("http")
    ) {
      return segment.text.link.url.trim();
    }
  }

  if (afterPrefix.startsWith("http")) {
    return afterPrefix.split(/\s+/)[0].trim();
  }

  return undefined;
}

export function extractUrls(
  block: BlockObjectResponse,
  prefix: string,
): string[] {
  let richTextArr: RichTextItemResponse[] = [];

  if (block.type === "paragraph") {
    richTextArr = block.paragraph.rich_text;
  } else if (block.type === "bulleted_list_item") {
    richTextArr = block.bulleted_list_item.rich_text;
  }

  if (richTextArr.length === 0) return [];

  const urls: string[] = [];

  // If Notion auto-linked the URL, grab href from the link object
  for (const segment of richTextArr) {
    if (segment.href && segment.href.startsWith("http")) {
      urls.push(segment.href.trim());
    } else if (
      segment.type === "text" &&
      segment.text?.link?.url &&
      segment.text.link.url.startsWith("http")
    ) {
      urls.push(segment.text.link.url.trim());
    }
  }

  // Check plain text for raw URLs separated by whitespace/newlines
  const fullText = richTextArr.map((t) => t.plain_text).join("");
  const afterPrefix = prefix ? fullText.replace(new RegExp(`^${prefix}:\\s*`, "i"), "").trim() : fullText;
  
  const rawUrls = afterPrefix.split(/[\s\n]+/).filter(word => word.startsWith("http"));
  for (const rawUrl of rawUrls) {
      if (!urls.includes(rawUrl)) urls.push(rawUrl);
  }

  return urls;
}
