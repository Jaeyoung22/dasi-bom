import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  const post_id = searchParams.get("post_id");

  if (!user_id || !post_id) {
    return NextResponse.json({ liked: false });
  }

  const { data } = await supabase
    .from("likes")
    .select("user_id")
    .eq("user_id", user_id)
    .eq("post_id", post_id)
    .single();

  return NextResponse.json({ liked: !!data });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  const { user_id, post_id } = await request.json();

  if (!user_id || !post_id) {
    return NextResponse.json({ error: "user_id, post_id required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("likes")
    .select("user_id")
    .eq("user_id", user_id)
    .eq("post_id", post_id)
    .single();

  if (existing) {
    await supabase
      .from("likes")
      .delete()
      .eq("user_id", user_id)
      .eq("post_id", post_id);

    const { data: post } = await supabase
      .from("posts")
      .select("likes_count")
      .eq("id", post_id)
      .single();

    await supabase
      .from("posts")
      .update({ likes_count: Math.max((post?.likes_count || 1) - 1, 0) })
      .eq("id", post_id);

    return NextResponse.json({ liked: false });
  } else {
    await supabase.from("likes").insert({ user_id, post_id });

    const { data: post } = await supabase
      .from("posts")
      .select("likes_count")
      .eq("id", post_id)
      .single();

    await supabase
      .from("posts")
      .update({ likes_count: (post?.likes_count || 0) + 1 })
      .eq("id", post_id);

    return NextResponse.json({ liked: true });
  }
}
