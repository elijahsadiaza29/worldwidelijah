import { clearPortfolioCache } from "@/lib/getPortfolioContext";
import { NextResponse } from "next/server";

export async function POST() {
  clearPortfolioCache();
  return NextResponse.json({ success: true, message: "Cache cleared!" });
}