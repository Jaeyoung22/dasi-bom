import { getSupabase } from "./supabase";

export async function uploadPhoto(file: File, path: string): Promise<string> {
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
