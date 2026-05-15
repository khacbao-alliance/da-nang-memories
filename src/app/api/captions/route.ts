import { NextRequest, NextResponse } from "next/server";
import { generateCaption } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const dayNumber = parseInt(body.dayNumber || "1", 10);

  const caption = await generateCaption(dayNumber);
  return NextResponse.json({ caption });
}
