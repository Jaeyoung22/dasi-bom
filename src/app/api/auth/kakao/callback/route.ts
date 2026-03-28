import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
  const isDev = process.env.NODE_ENV === "development";

  if (errorParam) {
    return NextResponse.json({ step: "kakao_error", error: errorParam });
  }

  if (!code) {
    return NextResponse.json({ step: "no_code", error: "code missing" });
  }

  const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  const CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
  const REDIRECT_URI = `${siteUrl}/api/auth/kakao/callback`;

  if (!REST_API_KEY || !CLIENT_SECRET) {
    return NextResponse.json({
      step: "env_check",
      error: "missing env vars",
      hasKey: !!REST_API_KEY,
      hasSecret: !!CLIENT_SECRET,
      siteUrl,
    });
  }

  try {
    // 1. 토큰 발급
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ step: "token_fail", tokenData });
    }

    // 2. 유저 정보
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const kakaoUser = await userRes.json();

    const kakaoId = String(kakaoUser.id);
    const nickname = kakaoUser.properties?.nickname || kakaoUser.kakao_account?.profile?.nickname || "익명";
    const avatarUrl = kakaoUser.properties?.profile_image || kakaoUser.kakao_account?.profile?.profile_image_url || null;

    // 3. DB 저장
    const supabase = getSupabase();

    const { data: existing, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", kakaoId)
      .single();

    if (findError && findError.code !== "PGRST116") {
      return NextResponse.json({ step: "db_find", error: findError });
    }

    let userId: string;

    if (existing) {
      userId = existing.id;
      await supabase
        .from("users")
        .update({ nickname, avatar_url: avatarUrl })
        .eq("id", userId);
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          auth_id: kakaoId,
          nickname,
          avatar_url: avatarUrl,
          provider: "kakao",
        })
        .select("id")
        .single();

      if (insertError) {
        return NextResponse.json({ step: "db_insert", error: insertError });
      }
      userId = newUser?.id || "";
    }

    // 4. 쿠키 세션
    const response = NextResponse.redirect(`${siteUrl}/`);
    const cookieOptions = {
      httpOnly: false,
      secure: !isDev,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    };
    response.cookies.set("kakao_user_id", userId, cookieOptions);
    response.cookies.set("kakao_nickname", encodeURIComponent(nickname), cookieOptions);
    response.cookies.set("kakao_avatar", encodeURIComponent(avatarUrl || ""), cookieOptions);

    return response;
  } catch (e) {
    return NextResponse.json({ step: "exception", error: String(e) });
  }
}
