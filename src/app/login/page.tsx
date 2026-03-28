"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DoveIllustration from "@/components/illustrations/DoveIllustration";
import CherryBlossom from "@/components/illustrations/CherryBlossom";
import WatercolorBlob from "@/components/illustrations/WatercolorBlob";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleKakaoLogin = () => {
    window.location.href = "/api/auth/kakao";
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6"
      style={{
        background: `linear-gradient(170deg, #f5ede0 0%, #faf5ec 30%, #f0e8d8 60%, #efe3d0 100%)`
      }}
    >
      {/* 벚꽃 파티클 */}
      <CherryBlossom count={12} />

      {/* 수채화 얼룩 배경 */}
      <WatercolorBlob className="absolute -top-20 -right-20" color="#d4a574" opacity={0.06} size={350} />
      <WatercolorBlob className="absolute bottom-20 -left-30" color="#8b6d47" opacity={0.04} size={280} />
      <WatercolorBlob className="absolute top-1/3 right-0" color="#b8845a" opacity={0.03} size={200} />

      {/* 비둘기 일러스트 */}
      <div className="relative mb-2 animate-fade-in-up">
        <DoveIllustration size={160} />
      </div>

      {/* 제목 */}
      <div className="relative text-center mb-16 animate-fade-in-up stagger-1">
        <h1 className="font-title text-[40px] text-ink leading-none tracking-tight">
          다시, 봄
        </h1>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-brown/40 to-transparent mx-auto mt-4 mb-3" />
        <p className="text-brown-dark/50 text-[13px] tracking-[3px]">
          빼앗긴 봄을 되찾습니다
        </p>
      </div>

      {error && (
        <div className="w-full max-w-[320px] mb-5 p-3.5 bg-red-50/80 border border-red-200/60 rounded-xl text-xs text-red-600 animate-fade-in">
          로그인 에러: {decodeURIComponent(error)}
        </div>
      )}

      {/* 카카오 로그인 */}
      <div className="relative w-full max-w-[300px] animate-fade-in-up stagger-2">
        <button
          onClick={handleKakaoLogin}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2.5 btn-press transition-all duration-300 hover:brightness-[0.97]"
          style={{
            backgroundColor: "#FEE500",
            color: "#191919",
            boxShadow: "0 4px 24px rgba(254, 229, 0, 0.25), 0 1px 3px rgba(0,0,0,0.06)"
          }}
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

      {/* 하단 안내 */}
      <p className="text-brown-dark/30 text-[10px] mt-12 text-center animate-fade-in stagger-3 tracking-wider">
        로그인하면 서비스 이용약관에 동의하는 것으로 간주됩니다
      </p>

      {/* 하단 장식 — 붓 터치 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brown/20 to-transparent" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(170deg, #f5ede0 0%, #faf5ec 50%, #efe3d0 100%)` }}
      >
        <DoveIllustration size={80} className="animate-pulse" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
