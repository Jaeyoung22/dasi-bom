import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/auth-server";

// 댓글 조회
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get("post_id");

  if (!post_id) {
    return NextResponse.json({ error: "post_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*, users(nickname, avatar_url)")
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 댓글 작성
export async function POST(request: NextRequest) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const body = await request.json();
  const { post_id, content } = body;
  const user_id = authUserId;

  if (!post_id || !content) {
    return NextResponse.json({ error: "필수 필드 누락" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id, user_id, content })
    .select("*, users(nickname, avatar_url)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 댓글 삭제
export async function DELETE(request: NextRequest) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const comment_id = searchParams.get("comment_id");

  if (!comment_id) {
    return NextResponse.json({ error: "comment_id required" }, { status: 400 });
  }

  const { data: comment } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", comment_id)
    .single();

  if (!comment || comment.user_id !== authUserId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await supabase.from("comments").delete().eq("id", comment_id);
  return NextResponse.json({ deleted: true });
}
