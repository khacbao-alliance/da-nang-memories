import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const mediaId = req.nextUrl.searchParams.get("mediaId");
  if (!mediaId) return NextResponse.json({ error: "mediaId required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("reactions")
    .select("*")
    .eq("media_id", mediaId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);

}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { media_id, emoji, created_by } = body;

  if (!media_id || !emoji || !created_by) {
    return NextResponse.json({ error: "media_id, emoji, created_by required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ id: "demo", media_id, emoji, created_by, created_at: new Date().toISOString() }, { status: 201 });
  }

  const { data, error } = await supabase
    .from("reactions")
    .insert({ media_id, emoji, created_by })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const mediaId = req.nextUrl.searchParams.get("mediaId");
  const emoji = req.nextUrl.searchParams.get("emoji");
  const createdBy = req.nextUrl.searchParams.get("createdBy");

  if (!mediaId || !emoji || !createdBy) {
    return NextResponse.json({ error: "mediaId, emoji, createdBy required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: true });

  const { error } = await supabase
    .from("reactions")
    .delete()
    .eq("media_id", mediaId)
    .eq("emoji", emoji)
    .eq("created_by", createdBy);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
