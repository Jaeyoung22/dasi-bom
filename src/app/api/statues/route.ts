import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import statuesWithCoords from "../../../../data/statues-with-coords.json";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");

  if (!isSupabaseConfigured) {
    let data = statuesWithCoords.map((s, i) => ({
      id: `seed-${i}`,
      ...s,
      image_url: null,
      created_at: new Date().toISOString(),
    }));
    if (region) {
      data = data.filter((s) => s.region === region);
    }
    return NextResponse.json(data);
  }

  let query = getSupabase().from("statues").select("*").order("region");
  if (region) {
    query = query.eq("region", region);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
