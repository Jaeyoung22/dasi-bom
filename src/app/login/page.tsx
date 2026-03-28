"use client";

import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleKakaoLogin = async () => {
    setLoading(true);
    const { signInWithKakao } = await import("@/lib/auth");
    await signInWithKakao();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { signInWithGoogle } = await import("@/lib/auth");
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      {/* 로고 영역 */}
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🕊️</div>
        <h1 className="text-3xl font-bold text-dark">다시, 봄</h1>
        <p className="text-brown-dark text-sm mt-2">
          빼앗긴 봄을 되찾습니다
        </p>
      </div>

      {/* 로그인 버튼 */}
      <div className="w-full max-w-[320px] space-y-3">
        <button
          onClick={handleKakaoLogin}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: "#FEE500", color: "#191919" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#191919"
              d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.63 5.18l-.93 3.44c-.08.3.26.54.52.37l4.1-2.72c.22.02.44.03.68.03 4.42 0 8-2.79 8-6.21S13.42 1 9 1z"
            />
          </svg>
          카카오로 시작하기
        </button>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-white border border-border text-dark disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.11-.85 2.05-1.81 2.68v2.23h2.93c1.71-1.58 2.7-3.9 2.7-6.55z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.93-2.23c-.81.54-1.84.86-3.03.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"/>
            <path fill="#FBBC05" d="M3.97 10.74c-.18-.54-.28-1.12-.28-1.74s.1-1.2.28-1.74V4.93H.96C.35 6.13 0 7.52 0 9s.35 2.87.96 4.07l3.01-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.93l3.01 2.33c.71-2.13 2.69-3.68 5.03-3.68z"/>
          </svg>
          Google로 시작하기
        </button>
      </div>

      {/* 하단 안내 */}
      <p className="text-brown-dark text-xs mt-8 text-center">
        로그인하면 서비스 이용약관에 동의하는 것으로 간주됩니다
      </p>
    </div>
  );
}
