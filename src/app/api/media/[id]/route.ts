import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { configureCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { caption } = body;

  if (caption === undefined) {
    return NextResponse.json({ error: "caption required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ id, caption });
  }

  const { data, error } = await supabase
    .from("media")
    .update({ caption })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: true });

  // Fetch public_id to delete from Cloudinary
  const { data: mediaRow } = await supabase
    .from("media")
    .select("public_id, media_type")
    .eq("id", id)
    .single();

  if (mediaRow?.public_id && isCloudinaryConfigured()) {
    const cld = configureCloudinary();
    const resourceType = mediaRow.media_type === "video" ? "video" : "image";
    await cld.uploader.destroy(mediaRow.public_id, { resource_type: resourceType }).catch(() => {});
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
