import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import statuesWithCoords from "../../../../../data/statues-with-coords.json";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured) {
    const index = parseInt(id.replace("seed-", ""), 10);
    const statue = statuesWithCoords[index];
    if (!statue) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      id,
      ...statue,
      image_url: null,
      created_at: new Date().toISOString(),
    });
  }

  const { data, error } = await getSupabase()
    .from("statues")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}
