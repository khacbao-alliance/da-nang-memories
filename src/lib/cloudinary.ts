import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder?: string; resource_type?: "image" | "video" | "auto" }
): Promise<{ secure_url: string; public_id: string }> {
  const cld = configureCloudinary();

  return new Promise((resolve, reject) => {
    cld.uploader
      .upload_stream(
        {
          folder: options.folder || "da-nang-memories",
          resource_type: options.resource_type || "auto",
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error("Upload failed"));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      )
      .end(buffer);
  });
}
