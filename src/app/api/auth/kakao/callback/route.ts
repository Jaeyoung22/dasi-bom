import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dasi-bom.vercel.app";

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/login?error=no_code`);
  }

  const REST_API_KEY = process.env.KAKAO_REST_API_KEY || "92baa982e60244c65116d5c61feaa141";
  const CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET || "yw923I09bLaQxnqB0bXpf16rTvYXhcgs";
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
      return NextResponse.redirect(`${siteUrl}/login?error=token_fail`);
    }

    // 2. 카카오 유저 정보 가져오기
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const kakaoUser = await userRes.json();

    const kakaoId = String(kakaoUser.id);
    const nickname = kakaoUser.properties?.nickname || "익명";
    const avatarUrl = kakaoUser.properties?.profile_image || null;

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
      // 닉네임/프로필 업데이트
      await supabase
        .from("users")
        .update({ nickname, avatar_url: avatarUrl })
        .eq("id", userId);
    } else {
      const { data: newUser } = await supabase
        .from("users")
        .insert({
          auth_id: kakaoId,
          nickname,
          avatar_url: avatarUrl,
          provider: "kakao",
        })
        .select("id")
        .single();

      userId = newUser?.id || "";
    }

    // 4. 세션 토큰을 쿠키에 저장 (간단한 방식)
    const response = NextResponse.redirect(`${siteUrl}/`);
    response.cookies.set("kakao_user_id", userId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30일
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
  } catch {
    return NextResponse.redirect(`${siteUrl}/login?error=unknown`);
  }
}
