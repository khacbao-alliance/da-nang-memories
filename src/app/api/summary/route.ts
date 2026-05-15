import { NextRequest, NextResponse } from "next/server";
import { generateDailySummary } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { dayNumber, mediaCount } = body;

  if (!dayNumber) {
    return NextResponse.json({ error: "dayNumber required" }, { status: 400 });
  }

  const summary = await generateDailySummary(Number(dayNumber), Number(mediaCount ?? 0));
  return NextResponse.json({ summary });
}
