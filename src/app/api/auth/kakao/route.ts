import { NextResponse } from "next/server";

// 카카오 로그인 시작 — account_email 없이 scope 지정
export async function GET() {
  const REST_API_KEY = process.env.KAKAO_REST_API_KEY || "92baa982e60244c65116d5c61feaa141";
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL || "https://dasi-bom.vercel.app"}/api/auth/kakao/callback`;

  const kakaoAuthUrl =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=profile_nickname,profile_image`;

  return NextResponse.redirect(kakaoAuthUrl);
}
