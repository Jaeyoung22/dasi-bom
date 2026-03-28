import { getSupabase } from "./supabase";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function uploadPhoto(file: File, path: string): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("파일 크기는 10MB 이하여야 합니다");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("지원하지 않는 파일 형식입니다 (JPG, PNG, WebP만 가능)");
  }

  const supabase = getSupabase();
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${path}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);
  return data.publicUrl;
}
