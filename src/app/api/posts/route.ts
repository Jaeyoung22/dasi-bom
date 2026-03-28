import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/auth-server";

// 게시글 목록 조회
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const statue_id = searchParams.get("statue_id");
  const category = searchParams.get("category");

  let query = supabase
    .from("posts")
    .select("*, users!posts_user_id_fkey(nickname, avatar_url), comments(count)")
    .order("created_at", { ascending: false });

  if (statue_id) query = query.eq("statue_id", statue_id);
  if (category && category !== "전체") query = query.eq("category", category);

  const { data, error } = await query.limit(50);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 게시글 작성
export async function POST(request: NextRequest) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const body = await request.json();
  const { statue_id, title, content, category, image_urls } = body;
  const user_id = authUserId;

  if (!statue_id || !content || !category) {
    return NextResponse.json({ error: "필수 필드 누락" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id,
      statue_id,
      title: title || content.substring(0, 50),
      content,
      category,
      image_urls: image_urls || [],
    })
    .select("*, users!posts_user_id_fkey(nickname, avatar_url)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 게시글 삭제
export async function DELETE(request: NextRequest) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get("post_id");

  if (!post_id) {
    return NextResponse.json({ error: "post_id required" }, { status: 400 });
  }

  const { data: post } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", post_id)
    .single();

  if (!post || post.user_id !== authUserId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await supabase.from("comments").delete().eq("post_id", post_id);
  await supabase.from("likes").delete().eq("post_id", post_id);
  await supabase.from("posts").delete().eq("id", post_id);

  return NextResponse.json({ deleted: true });
}
