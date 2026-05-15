import { NextRequest, NextResponse } from "next/server";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const dayNumber = parseInt(formData.get("dayNumber") as string, 10);
  const caption = (formData.get("caption") as string) || "";
  const uploadedBy = (formData.get("uploadedBy") as string) || "Anonymous";
  const mediaType = (formData.get("mediaType") as string) || "image";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let cloudinaryUrl: string;
  let publicId: string;

  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadToCloudinary(buffer, {
        folder: "da-nang-memories",
        resource_type: mediaType === "video" ? "video" : "image",
      });
      cloudinaryUrl = result.secure_url;
      publicId = result.public_id;
    } catch (err) {
      console.error("[upload] Cloudinary error:", err);
      return NextResponse.json({ error: "Upload to Cloudinary failed" }, { status: 500 });
    }
  } else {
    // Demo mode: return a placeholder URL
    const seed = Math.floor(Math.random() * 999) + 1;
    cloudinaryUrl = `https://picsum.photos/seed/${seed}/800/1000`;
    publicId = `demo/${seed}`;
  }

  const mediaRecord = {
    day_number: dayNumber,
    media_type: mediaType,
    cloudinary_url: cloudinaryUrl,
    public_id: publicId,
    uploaded_by: uploadedBy,
    caption,
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from("media").insert(mediaRecord);
      if (error) console.error("[upload] Supabase insert error:", error);
    }
  }

  return NextResponse.json({ url: cloudinaryUrl, publicId, ...mediaRecord }, { status: 201 });
}
