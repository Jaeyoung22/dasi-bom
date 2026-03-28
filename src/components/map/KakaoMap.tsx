"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

interface MarkerData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  visited?: boolean;
}

interface KakaoMapProps {
  markers: MarkerData[];
  onMarkerClick?: (marker: MarkerData) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || "";

export default function KakaoMap({
  markers,
  onMarkerClick,
  userLocation,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SDK 로드 — 직접 DOM에 script 삽입
  useEffect(() => {
    // 이미 ready
    if (window.kakao?.maps?.LatLng) {
      const id = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(id);
    }

    // 이미 load 함수가 있으면 호출
    if (window.kakao?.maps?.load) {
      window.kakao.maps.load(() => setReady(true));
      return;
    }

    // 이미 스크립트 태그가 있으면 대기만
    const existing = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existing) {
      const wait = setInterval(() => {
        if (window.kakao?.maps?.load) {
          clearInterval(wait);
          window.kakao.maps.load(() => setReady(true));
        }
      }, 300);
      return () => clearInterval(wait);
    }

    // 새로 삽입
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(() => setReady(true));
      } else {
        setError("SDK 로드 후 maps.load를 찾을 수 없습니다");
      }
    };
    script.onerror = () => setError("SDK 스크립트 로드 실패");
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    // 아직 지도 없으면 생성
    if (!mapInstanceRef.current) {
      const lat = userLocation?.lat ?? 37.5665;
      const lng = userLocation?.lng ?? 126.978;
      const level = userLocation ? 8 : 12;
      const center = new window.kakao.maps.LatLng(lat, lng);
      mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
        center,
        level,
      });
      return;
    }

    // 지도 이미 있고 유저 위치가 들어오면 중심 이동
    if (userLocation && mapInstanceRef.current) {
      const center = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setLevel(8);
    }
  }, [ready, userLocation]);

  // 마커
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !ready) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    markers
      .filter((m) => m.latitude !== 0 && m.longitude !== 0)
      .forEach((marker) => {
        const pos = new window.kakao.maps.LatLng(marker.latitude, marker.longitude);
        const km = new window.kakao.maps.Marker({ map, position: pos, title: marker.name });
        markersRef.current.push(km);

        const iw = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;white-space:nowrap;">${marker.name}</div>`,
        });
        window.kakao.maps.event.addListener(km, "click", () => {
          iw.open(map, km);
          onMarkerClick?.(marker);
        });
      });

    if (userLocation) {
      const pos = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
      new window.kakao.maps.Circle({
        map, center: pos, radius: 20,
        strokeWeight: 3, strokeColor: "#4a90d9", strokeOpacity: 0.8,
        fillColor: "#4a90d9", fillOpacity: 0.5,
      });
    }
  }, [ready, markers, userLocation, onMarkerClick]);

  if (error) {
    return (
      <div className="flex-1 bg-beige flex items-center justify-center">
        <p className="text-xs text-brown-dark">{error}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex-1 bg-beige flex items-center justify-center">
        <p className="text-sm text-brown-dark">지도 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full relative">
      <div ref={mapRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />
    </div>
  );
}
