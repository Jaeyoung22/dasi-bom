"use client";

import { useEffect, useState, createContext, useContext } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const KakaoContext = createContext(false);

export function useKakaoReady() {
  return useContext(KakaoContext);
}

export default function KakaoMapLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 이미 로드 완료
    if (window.kakao?.maps?.LatLng) {
      const id = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(id);
    }

    // 스크립트가 이미 있으면 스킵
    if (document.querySelector('script[src*="dapi.kakao.com"]')) {
      return;
    }

    const script = document.createElement("script");
    // autoload=false → document.write 방지
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || "";
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("[KakaoMapLoader] SDK ready");
        setReady(true);
      });
    };
    script.onerror = () => {
      console.error("[KakaoMapLoader] script load failed");
    };
    document.head.appendChild(script);
  }, []);

  return (
    <KakaoContext.Provider value={ready}>{children}</KakaoContext.Provider>
  );
}
