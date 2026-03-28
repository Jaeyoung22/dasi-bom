import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dasi-bom.vercel.app";

  if (errorParam) {
    return NextResponse.redirect(`${siteUrl}/login?error=${errorParam}`);
  }

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/login?error=no_code`);
  }

  const REST_API_KEY = process.env.KAKAO_REST_API_KEY!;
  const CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET!;
  const REDIRECT_URI = `${siteUrl}/api/auth/kakao/callback`;

  try {
    // 1. 인가 코드로 토큰 발급
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
      const msg = tokenData.error_description || tokenData.error || "token_fail";
      return NextResponse.redirect(`${siteUrl}/login?error=${encodeURIComponent(msg)}`);
    }

    // 2. 카카오 유저 정보 가져오기
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const kakaoUser = await userRes.json();

    const kakaoId = String(kakaoUser.id);
    const nickname = kakaoUser.properties?.nickname || kakaoUser.kakao_account?.profile?.nickname || "익명";
    const avatarUrl = kakaoUser.properties?.profile_image || kakaoUser.kakao_account?.profile?.profile_image_url || null;

    // 3. Supabase users 테이블에서 찾거나 생성
    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", kakaoId)
      .single();

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
        return NextResponse.redirect(`${siteUrl}/login?error=${encodeURIComponent("db_insert: " + insertError.message)}`);
      }

      userId = newUser?.id || "";
    }

    // 4. 쿠키에 세션 저장
    const response = NextResponse.redirect(`${siteUrl}/`);
    response.cookies.set("kakao_user_id", userId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    response.cookies.set("kakao_nickname", encodeURIComponent(nickname), {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    response.cookies.set("kakao_avatar", encodeURIComponent(avatarUrl || ""), {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (e) {
    return NextResponse.redirect(`${siteUrl}/login?error=${encodeURIComponent(String(e))}`);
  }
}
