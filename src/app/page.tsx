"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatsCard from "@/components/home/StatsCard";
import NearbyStatueItem from "@/components/home/NearbyStatueItem";
import RecentPost from "@/components/home/RecentPost";
import BrushStroke from "@/components/illustrations/BrushStroke";
import WatercolorBlob from "@/components/illustrations/WatercolorBlob";
import { useAuth } from "@/lib/auth-context";
import { useUserLocation } from "@/lib/hooks";
import { calculateDistance, formatDistance } from "@/lib/geo";

interface StatueData {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function HomePage() {
  const { location } = useUserLocation();
  const [nearbyStatues, setNearbyStatues] = useState<
    (StatueData & { distance: string })[]
  >([]);

  useEffect(() => {
    if (!location) return;

    fetch("/api/statues")
      .then((res) => res.json())
      .then((statues: StatueData[]) => {
        const withDistance = statues
          .filter((s) => s.latitude !== 0)
          .map((s) => ({
            ...s,
            distanceMeters: calculateDistance(
              location.lat,
              location.lng,
              s.latitude,
              s.longitude
            ),
            distance: formatDistance(
              calculateDistance(
                location.lat,
                location.lng,
                s.latitude,
                s.longitude
              )
            ),
          }))
          .sort((a, b) => a.distanceMeters - b.distanceMeters)
          .slice(0, 5);

        setNearbyStatues(withDistance);
      })
      .catch(() => {});
  }, [location]);

  const { user } = useAuth();

  return (
    <div className="pb-4 relative">
      {/* 수채화 얼룩 배경 */}
      <WatercolorBlob className="absolute top-40 -right-20 pointer-events-none" color="#d4a574" opacity={0.04} size={250} />
      <WatercolorBlob className="absolute bottom-40 -left-20 pointer-events-none" color="#8b6d47" opacity={0.03} size={200} />

      {/* 헤더 — 저널 표지 */}
      <div className="relative overflow-hidden" style={{
        background: `linear-gradient(175deg, #2c2419 0%, #3d3128 40%, #4a3d2e 70%, #5a4d3c 100%)`
      }}>
        {/* 수채화 질감 오버레이 */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(ellipse at 20% 80%, rgba(212,165,116,0.4), transparent 50%),
                           radial-gradient(ellipse at 80% 20%, rgba(184,132,90,0.3), transparent 40%),
                           radial-gradient(ellipse at 50% 50%, rgba(139,109,71,0.2), transparent 60%)`
        }} />

        <div className="relative px-6 pt-6 pb-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] tracking-[4px] uppercase text-white/30 mb-2">다시, 봄</p>
              <h1 className="font-title text-[24px] text-white/95 leading-[1.3]">
                {user ? (
                  <>
                    {user.nickname}님의<br />
                    <span className="text-accent-warm/80 text-[20px]">기억의 여정</span>
                  </>
                ) : (
                  "기억의 여정"
                )}
              </h1>
            </div>
            <Link href="/mypage" className="shrink-0 mt-1">
              <div className="w-11 h-11 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden transition-all hover:bg-white/12">
                {user?.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/60 text-lg">👤</span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="relative px-5 mt-5">
          <UserStats userId={user?.dbId} />
        </div>

      </div>

      {/* 가까운 소녀상 */}
      <div className="px-5 pt-5 pb-2 relative">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="font-title text-[16px] text-dark">가까운 소녀상</h2>
            <p className="text-[10px] text-brown-dark/40 mt-0.5">가장 가까운 기억의 장소</p>
          </div>
          <Link href="/map" className="text-[11px] text-brown/70 hover:text-brown transition-colors font-medium">
            지도 보기 →
          </Link>
        </div>
        <div className="space-y-2.5">
          {nearbyStatues.length > 0 ? (
            nearbyStatues.map((statue, i) => (
              <div key={statue.id} className={`animate-fade-in-up stagger-${i + 1}`}>
                <NearbyStatueItem {...statue} />
              </div>
            ))
          ) : (
            <div className="text-xs text-brown-dark/40 text-center py-8 italic">
              {location ? "소녀상을 찾고 있어요..." : "위치를 확인하는 중..."}
            </div>
          )}
        </div>
      </div>

      {/* 붓 터치 구분선 */}
      <div className="px-5 my-5">
        <BrushStroke className="w-full h-3" />
      </div>

      {/* 최근 이야기 */}
      <div className="px-5 pb-2 relative">
        <div className="mb-4">
          <h2 className="font-title text-[16px] text-dark">최근 이야기</h2>
          <p className="text-[10px] text-brown-dark/40 mt-0.5">방문자들이 남긴 기록</p>
        </div>
        <RecentPosts />
      </div>
    </div>
  );
}

function UserStats({ userId }: { userId: string | null | undefined }) {
  const [stats, setStats] = useState({ visitCount: 0, badgeCount: 0, rank: null as number | null });

  useEffect(() => {
    const url = userId ? `/api/user-stats?user_id=${userId}` : "/api/user-stats";
    fetch(url)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, [userId]);

  return <StatsCard {...stats} />;
}

interface PostItem {
  id: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
  users?: { nickname: string; avatar_url: string | null };
  comments?: { count: number }[];
}

function RecentPosts() {
  const [posts, setPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (posts.length === 0) {
    return (
      <div className="text-xs text-brown-dark/40 text-center py-8 italic">
        아직 이야기가 없어요
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post, i) => (
        <div key={post.id} className={`animate-fade-in stagger-${i + 1}`}>
          <RecentPost
            nickname={post.users?.nickname || "익명"}
            timeAgo={timeAgo(post.created_at)}
            content={post.content}
            likes={post.likes_count || 0}
            comments={post.comments?.[0]?.count || 0}
          />
        </div>
      ))}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}
