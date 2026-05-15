import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const day = parseInt(searchParams.get("day") || "1", 10);

  try {
    if (!isSupabaseConfigured()) return NextResponse.json([]);

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json([]);

    const { data, error } = await supabase
      .from("media")
      .select("*")
      .eq("day_number", day)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[media GET]", error.message);
      return NextResponse.json([]);
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("[media GET] unexpected:", err);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { memory_day_id, day_number, media_type, cloudinary_url, public_id, uploaded_by, caption } = body;

  if (!cloudinary_url || !uploaded_by || !day_number) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ id: crypto.randomUUID(), ...body, created_at: new Date().toISOString() });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data, error } = await supabase
    .from("media")
    .insert({ memory_day_id, day_number, media_type, cloudinary_url, public_id, uploaded_by, caption })
    .select()
    .single();

  if (error) {
    console.error("[media POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
