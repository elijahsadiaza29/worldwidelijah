import { getPortfolioContext } from "@/lib/getPortfolioContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

// ⚠️ Do NOT use "edge" runtime — Notion SDK needs Node.js
// export const runtime = "edge";  ← remove this if you have it

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = await getPortfolioContext();

    const history = messages
      .slice(0, -1)
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const lastMessage = messages[messages.length - 1].content;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    const is429 = msg.includes("429") || msg.includes("quota");

    const userMessage = is429
      ? "I'm getting too many requests right now — please try again in a minute!"
      : "Sorry, I encountered an error. Please try again.";

    return new Response(userMessage, {
      status: is429 ? 429 : 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
