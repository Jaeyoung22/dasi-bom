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
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🕊️</div>
        <h1 className="text-3xl font-bold text-dark">다시, 봄</h1>
        <p className="text-brown-dark text-sm mt-2">
          빼앗긴 봄을 되찾습니다
        </p>
      </div>

      {error && (
        <div className="w-full max-w-[320px] mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          로그인 에러: {decodeURIComponent(error)}
        </div>
      )}

      <div className="w-full max-w-[320px]">
        <button
          onClick={handleKakaoLogin}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
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
      </div>

      <p className="text-brown-dark text-xs mt-8 text-center">
        로그인하면 서비스 이용약관에 동의하는 것으로 간주됩니다
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-4xl">🕊️</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
