import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") || "전체";
  const region = searchParams.get("region") || "";

  if (tab === "이번 달") {
    // 이번 달 뱃지 기준 랭킹
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data: monthlyBadges, error } = await supabase
      .from("badges")
      .select("user_id")
      .gte("earned_at", startOfMonth);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 유저별 이번 달 뱃지 수 집계
    const countMap = new Map<string, number>();
    monthlyBadges?.forEach((b) => {
      countMap.set(b.user_id, (countMap.get(b.user_id) || 0) + 1);
    });

    const userIds = [...countMap.keys()];
    if (userIds.length === 0) return NextResponse.json([]);

    const { data: users } = await supabase
      .from("users")
      .select("id, nickname, avatar_url, total_badges, created_at")
      .in("id", userIds);

    const result = (users || [])
      .map((u) => ({ ...u, total_badges: countMap.get(u.id) || 0 }))
      .sort((a, b) => b.total_badges - a.total_badges);

    return NextResponse.json(result);
  }

  if (tab === "지역별" && region) {
    // 해당 지역 뱃지 기준 랭킹
    const { data: regionBadges, error } = await supabase
      .from("badges")
      .select("user_id, statues!badges_statue_id_fkey(region)")
      .eq("badge_type", "regional");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 해당 지역 뱃지만 필터
    const countMap = new Map<string, number>();
    regionBadges?.forEach((b) => {
      const statues = b.statues as unknown as { region: string } | null;
      if (statues?.region === region) {
        countMap.set(b.user_id, (countMap.get(b.user_id) || 0) + 1);
      }
    });

    const userIds = [...countMap.keys()];
    if (userIds.length === 0) return NextResponse.json([]);

    const { data: users } = await supabase
      .from("users")
      .select("id, nickname, avatar_url, total_badges, created_at")
      .in("id", userIds);

    const result = (users || [])
      .map((u) => ({ ...u, total_badges: countMap.get(u.id) || 0 }))
      .sort((a, b) => b.total_badges - a.total_badges);

    return NextResponse.json(result);
  }

  // 전체 랭킹 (기존)
  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, avatar_url, total_badges, created_at")
    .order("total_badges", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
