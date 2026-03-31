import { getPortfolioMedia } from "@/lib/getPortfolioContext";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const force = req.nextUrl.searchParams.get("force") === "true";
    const media = await getPortfolioMedia(force);
    return NextResponse.json(media);
  } catch (error) {
    console.error("Portfolio media error:", error);
    return NextResponse.json(
      { projects: [], profilePhoto: undefined },
      { status: 500 },
    );
  }
}
