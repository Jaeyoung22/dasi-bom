import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const statue_id = searchParams.get("statue_id");

  if (!statue_id) {
    return NextResponse.json({ error: "statue_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("visits")
    .select("id, photo_url, visited_at, users!visits_user_id_fkey(nickname, avatar_url)")
    .eq("statue_id", statue_id)
    .order("visited_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  const body = await request.json();
  const { user_id, statue_id, photo_url } = body;

  if (!user_id || !statue_id || !photo_url) {
    return NextResponse.json(
      { error: "user_id, statue_id, photo_url are required" },
      { status: 400 }
    );
  }

  // 방문 기록 저장
  const { data: visit, error: visitError } = await supabase
    .from("visits")
    .insert({ user_id, statue_id, photo_url })
    .select()
    .single();

  if (visitError) {
    return NextResponse.json({ error: visitError.message }, { status: 500 });
  }

  // 이미 이 소녀상 뱃지가 있는지 확인
  const { data: existingBadge } = await supabase
    .from("badges")
    .select("id")
    .eq("user_id", user_id)
    .eq("statue_id", statue_id)
    .eq("badge_type", "regional")
    .single();

  let badge = null;

  if (!existingBadge) {
    // 소녀상 정보 가져오기 (뱃지 이름용)
    const { data: statue } = await supabase
      .from("statues")
      .select("name, region")
      .eq("id", statue_id)
      .single();

    const badgeName = statue ? `${statue.region}의 봄` : "봄";

    // 뱃지 부여
    const { data: newBadge } = await supabase
      .from("badges")
      .insert({
        user_id,
        statue_id,
        badge_type: "regional",
        badge_name: badgeName,
      })
      .select()
      .single();

    badge = newBadge;

    // 총 뱃지 수 업데이트
    const { count } = await supabase
      .from("badges")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user_id);

    await supabase
      .from("users")
      .update({ total_badges: count || 0 })
      .eq("id", user_id);

    // 첫 번째 봄 뱃지 확인
    if (count === 1) {
      await supabase.from("badges").insert({
        user_id,
        statue_id: null,
        badge_type: "first_visit",
        badge_name: "첫 번째 봄",
      });
    }
  }

  return NextResponse.json({ visit, badge, isNewBadge: !!badge });
}
