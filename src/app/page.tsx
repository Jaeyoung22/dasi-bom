"use client";

import { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
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
      });
  }, [location]);

  const { user } = useAuth();

  return (
    <div>
      <Header
        title={user ? `${user.nickname}님, 안녕하세요` : "안녕하세요"}
        subtitle="다시, 봄"
        rightElement={
          <div className="w-9 h-9 rounded-full bg-brown flex items-center justify-center text-base overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : "👤"}
          </div>
        }
      />

      <div className="px-5 py-4">
        <StatsCard visitCount={0} badgeCount={0} rank={null} />
      </div>

      <div className="px-5">
        <div className="text-sm font-bold text-dark mb-3">
          📍 가까운 소녀상
        </div>
        <div className="space-y-2.5">
          {nearbyStatues.length > 0 ? (
            nearbyStatues.map((statue) => (
              <NearbyStatueItem key={statue.id} {...statue} />
            ))
          ) : (
            <div className="text-xs text-brown-dark text-center py-4">
              {location ? "소녀상 데이터를 불러오는 중..." : "위치를 확인하는 중..."}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="text-sm font-bold text-dark mb-3">
          📋 최근 게시글
        </div>
        <RecentPosts />
      </div>
    </div>
  );
}

function RecentPosts() {
  const [posts, setPosts] = useState<any[]>([]);

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
      <div className="text-xs text-brown-dark text-center py-4">
        아직 게시글이 없어요
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {posts.map((post) => (
        <RecentPost
          key={post.id}
          nickname={post.users?.nickname || "익명"}
          timeAgo={timeAgo(post.created_at)}
          content={post.content}
          likes={post.likes_count || 0}
          comments={0}
        />
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
