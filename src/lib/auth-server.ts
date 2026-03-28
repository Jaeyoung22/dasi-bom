import { NextRequest } from "next/server";

/**
 * 서버사이드에서 쿠키 기반 user_id 검증
 * 반환값이 null이면 인증 실패
 */
export function getAuthUserId(request: NextRequest): string | null {
  const userId = request.cookies.get("kakao_user_id")?.value;
  return userId || null;
}
