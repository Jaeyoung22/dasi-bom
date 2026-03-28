"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import KakaoMap from "@/components/map/KakaoMap";
import { calculateDistance, formatDistance } from "@/lib/geo";

interface StatueData {
  id: string;
  name: string;
  address: string;
  region: string;
  latitude: number;
  longitude: number;
}

const regions = ["전체", "서울", "경기", "부산", "대전", "대구", "기타"];

export default function MapPage() {
  const [statues, setStatues] = useState<StatueData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedStatue, setSelectedStatue] = useState<StatueData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/statues")
      .then((res) => res.json())
      .then((data) => setStatues(data));
  }, []);

  // 내 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // 위치 권한 거부 시 서울 시청 기본값
          setUserLocation({ lat: 37.5665, lng: 126.978 });
        }
      );
    }
  }, []);

  const filtered = statues.filter((s) => {
    const regionMatch =
      selectedRegion === "전체" ||
      s.region === selectedRegion ||
      (selectedRegion === "기타" &&
        !["서울", "경기", "부산", "대전", "대구"].includes(s.region));
    const searchMatch =
      !searchQuery ||
      s.name.includes(searchQuery) ||
      s.address.includes(searchQuery);
    return regionMatch && searchMatch;
  });

  // 유저 위치 기준 가까운 순 정렬
  const sorted = userLocation
    ? [...filtered].sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
        return distA - distB;
      })
    : filtered;

  const handleMarkerClick = useCallback((marker: { id: string; name: string; latitude: number; longitude: number }) => {
    const statue = statues.find((s) => s.id === marker.id);
    if (statue) setSelectedStatue(statue);
  }, [statues]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* 검색 */}
      <div className="bg-dark px-5 py-3">
        <div className="bg-white/15 rounded-[10px] px-3.5 py-2.5 flex items-center gap-2">
          <span className="text-brown-dark">🔍</span>
          <input
            type="text"
            placeholder="소녀상 이름 또는 지역 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-cream placeholder:text-cream/50 text-[13px] outline-none flex-1"
          />
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-white px-5 py-2.5 flex gap-2 border-b border-border overflow-x-auto">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => {
              setSelectedRegion(r);
              setSelectedStatue(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
              selectedRegion === r
                ? "bg-dark text-cream"
                : "bg-surface-muted text-brown-dark"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 지도 */}
      <KakaoMap
        markers={filtered.map((s) => ({
          id: s.id,
          name: s.name,
          latitude: s.latitude,
          longitude: s.longitude,
        }))}
        onMarkerClick={handleMarkerClick}
        userLocation={userLocation}
      />

      {/* 하단 카드/리스트 */}
      <div className="bg-white px-5 py-4 border-t border-border">
        {selectedStatue ? (
          <Link href={`/statues/${selectedStatue.id}`}>
            <div className="bg-cream rounded-[14px] p-4 flex gap-3.5 items-center">
              <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-[#f5e8e9] to-[#efe0d5] flex items-center justify-center text-[28px] shrink-0">
                🌸
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-dark truncate">
                  {selectedStatue.name}
                </div>
                <div className="text-[11px] text-brown-dark mt-0.5 truncate">
                  {selectedStatue.address}
                </div>
              </div>
              <div className="bg-dark text-cream px-3.5 py-2 rounded-[10px] text-xs font-semibold whitespace-nowrap">
                상세보기
              </div>
            </div>
          </Link>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            <div className="text-[11px] text-brown-dark mb-1">
              {sorted.length}개의 소녀상
            </div>
            {sorted.slice(0, 5).map((s) => {
              const dist = userLocation
                ? formatDistance(calculateDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude))
                : null;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatue(s)}
                  className="w-full bg-cream rounded-xl p-3 flex gap-3 items-center text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f5e8e9] to-[#efe0d5] flex items-center justify-center text-lg shrink-0">
                    🌸
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-dark truncate">
                      {s.name}
                    </div>
                    <div className="text-[10px] text-brown-dark truncate">
                      {s.address}
                    </div>
                  </div>
                  {dist && (
                    <div className="text-[11px] text-brown font-semibold shrink-0">{dist}</div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
