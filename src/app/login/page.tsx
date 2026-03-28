"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleKakaoLogin = () => {
    window.location.href = "/api/auth/kakao";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5ede0] via-cream to-[#efe6d5] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-full h-1/3 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(ellipse at 30% 0%, #8b6d47, transparent 60%),
                         radial-gradient(ellipse at 70% 20%, #b8845a, transparent 50%)`
      }} />

      <div className="relative text-center mb-14 animate-fade-in-up">
        <div className="text-6xl mb-5 drop-shadow-sm">🕊️</div>
        <h1 className="font-title text-[34px] text-dark leading-tight tracking-tight">
          다시, 봄
        </h1>
        <p className="text-brown-dark/70 text-[13px] mt-3 tracking-[1px]">
          빼앗긴 봄을 되찾습니다
        </p>
      </div>

      {error && (
        <div className="w-full max-w-[320px] mb-5 p-3.5 bg-red-50/80 border border-red-200/60 rounded-xl text-xs text-red-600 animate-fade-in">
          로그인 에러: {decodeURIComponent(error)}
        </div>
      )}

      <div className="relative w-full max-w-[320px] animate-fade-in stagger-2">
        <button
          onClick={handleKakaoLogin}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2.5 btn-press shadow-[0_2px_12px_rgba(254,229,0,0.3)] hover:shadow-[0_4px_20px_rgba(254,229,0,0.4)] transition-shadow"
          style={{ backgroundColor: "#FEE500", color: "#191919" }}
        >
          <svg width="20" height="20" viewBox="0 0 18 18">
            <path
              fill="#191919"
              d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.63 5.18l-.93 3.44c-.08.3.26.54.52.37l4.1-2.72c.22.02.44.03.68.03 4.42 0 8-2.79 8-6.21S13.42 1 9 1z"
            />
          </svg>
          카카오로 시작하기
        </button>
      </div>

      <p className="text-brown-dark/40 text-[11px] mt-10 text-center animate-fade-in stagger-3">
        로그인하면 서비스 이용약관에 동의하는 것으로 간주됩니다
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-5xl animate-bounce">🕊️</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
