import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ visitCount: 0, badgeCount: 0, rank: null });
  }

  // 방문 수
  const { count: visitCount } = await supabase
    .from("visits")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user_id);

  // 뱃지 수
  const { count: badgeCount } = await supabase
    .from("badges")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user_id);

  // 랭킹
  const { data: allUsers } = await supabase
    .from("users")
    .select("id, total_badges")
    .order("total_badges", { ascending: false });

  const rank = allUsers?.findIndex((u) => u.id === user_id);
  const userRank = rank !== undefined && rank >= 0 ? rank + 1 : null;

  return NextResponse.json({
    visitCount: visitCount || 0,
    badgeCount: badgeCount || 0,
    rank: userRank,
  });
}
