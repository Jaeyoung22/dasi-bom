"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatsCard from "@/components/home/StatsCard";
import NearbyStatueItem from "@/components/home/NearbyStatueItem";
import RecentPost from "@/components/home/RecentPost";
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
    <div className="pb-4">
      {/* 헤더 — 한지 느낌의 그라데이션 */}
      <div className="relative bg-gradient-to-b from-[#2c2419] via-[#3d3128] to-[#4a3d2e] text-cream px-6 pt-6 pb-8 overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15), transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(184,132,90,0.1), transparent 40%)`
        }} />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[3px] uppercase opacity-50 mb-1">다시, 봄</p>
            <h1 className="font-title text-[22px] leading-tight">
              {user ? (
                <>
                  {user.nickname}님,<br />
                  <span className="opacity-70 text-lg">봄을 되찾는 여정에 함께해요</span>
                </>
              ) : (
                "안녕하세요"
              )}
            </h1>
          </div>
          <Link href="/mypage" className="shrink-0 mt-1">
            <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-lg overflow-hidden">
              {user?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : "👤"}
            </div>
          </Link>
        </div>

        {/* 통계 카드 — 헤더 아래로 걸치는 레이아웃 */}
        <div className="relative mt-5 -mb-14">
          <UserStats userId={user?.dbId} />
        </div>
      </div>

      {/* 가까운 소녀상 */}
      <div className="px-5 pt-18 pb-2">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-title text-[15px] text-dark">가까운 소녀상</h2>
          <Link href="/map" className="text-[11px] text-brown-dark hover:text-brown transition-colors">
            지도 보기 →
          </Link>
        </div>
        <div className="space-y-2">
          {nearbyStatues.length > 0 ? (
            nearbyStatues.map((statue, i) => (
              <div key={statue.id} className={`animate-fade-in-up stagger-${i + 1}`}>
                <NearbyStatueItem {...statue} />
              </div>
            ))
          ) : (
            <div className="text-xs text-brown-dark/60 text-center py-6">
              {location ? "소녀상 데이터를 불러오는 중..." : "위치를 확인하는 중..."}
            </div>
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div className="divider-ink mx-5 my-4" />

      {/* 최근 게시글 */}
      <div className="px-5 pb-2">
        <h2 className="font-title text-[15px] text-dark mb-3">최근 이야기</h2>
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
      <div className="text-xs text-brown-dark/60 text-center py-6">
        아직 이야기가 없어요
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
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
