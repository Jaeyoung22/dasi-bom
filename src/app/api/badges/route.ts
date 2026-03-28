import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const { data: badges, error } = await supabase
    .from("badges")
    .select("*, statues(name, region)")
    .eq("user_id", user_id)
    .order("earned_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 전체 소녀상 수
  const { count: totalStatues } = await supabase
    .from("statues")
    .select("id", { count: "exact", head: true });

  return NextResponse.json({
    badges: badges || [],
    totalStatues: totalStatues || 0,
  });
}
