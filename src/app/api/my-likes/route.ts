import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("likes")
    .select("post_id, posts!likes_post_id_fkey(id, content, category, likes_count, created_at, users!posts_user_id_fkey(nickname, avatar_url))")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // flatten: likes → posts
  const posts = data?.map((d) => d.posts).filter(Boolean) || [];
  return NextResponse.json(posts);
}
