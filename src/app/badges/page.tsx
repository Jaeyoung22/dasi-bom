"use client";

import { useState, useEffect } from "react";
import BadgeIcon from "@/components/ui/BadgeIcon";
import { useAuth } from "@/lib/auth-context";

interface BadgeData {
  id: string;
  badge_type: string;
  badge_name: string;
  earned_at: string;
  statues?: { name: string; region: string } | null;
}

const ALL_REGIONS = [
  "서울", "경기", "인천", "부산", "대전", "대구",
  "울산", "광주", "세종", "강원", "충남", "충북",
  "전북", "전남", "경북", "경남", "제주",
];

export default function BadgesPage() {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [totalStatues, setTotalStatues] = useState(84);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.dbId) return;
    fetch(`/api/badges?user_id=${user.dbId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.badges) setBadges(data.badges);
        if (data.totalStatues) setTotalStatues(data.totalStatues);
      })
      .catch(() => {});
  }, []);

  const earnedCount = badges.filter((b) => b.badge_type === "regional").length;
  const progress = totalStatues > 0 ? Math.round((earnedCount / totalStatues) * 100) : 0;

  const hasFirstVisit = badges.some((b) => b.badge_type === "first_visit");
  const earnedRegions = new Set(
    badges
      .filter((b) => b.badge_type === "regional" && b.statues)
      .map((b) => b.statues!.region)
  );

  const specialBadges = [
    { name: "첫 번째 봄", desc: "첫 번째 방문", emoji: "👣", earned: hasFirstVisit },
    {
      name: "서울의 봄",
      desc: "서울 전체 방문",
      emoji: "🏙️",
      earned: false,
      progress: `${badges.filter((b) => b.statues?.region === "서울").length}/14`,
    },
    {
      name: "전국의 봄",
      desc: "전국 방문 완료",
      emoji: "🇰🇷",
      earned: false,
      progress: earnedCount > 0 ? `${earnedCount}/${totalStatues}` : "미달성",
    },
  ];

  return (
    <div>
      {/* 헤더 */}
      <div className="bg-dark text-cream px-5 py-5">
        <div className="text-[11px] tracking-[2px] opacity-70">다시, 봄</div>
        <h1 className="text-xl font-bold mt-1">내 뱃지 컬렉션</h1>
        <div className="flex gap-5 mt-3">
          <div>
            <div className="text-2xl font-extrabold">{earnedCount}</div>
            <div className="text-[10px] opacity-70">획득한 봄</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold opacity-40">
              {totalStatues}
            </div>
            <div className="text-[10px] opacity-70">전체 소녀상</div>
          </div>
        </div>
        <div className="mt-3 bg-white/15 rounded-[10px] h-2 overflow-hidden">
          <div
            className="bg-brown h-full rounded-[10px] transition-all"
            style={{ width: `${Math.max(progress, 1)}%` }}
          />
        </div>
        <div className="text-[10px] opacity-60 mt-1">
          전체의 {progress}% 달성
        </div>
      </div>

      {/* 특별 뱃지 */}
      <div className="px-5 py-5">
        <h2 className="text-sm font-bold text-dark mb-3.5">🌟 특별 뱃지</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {specialBadges.map((badge) => (
            <div
              key={badge.name}
              className={`min-w-[100px] text-center bg-white rounded-[14px] p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
                !badge.earned ? "opacity-40" : ""
              }`}
            >
              <div className="mx-auto mb-2">
                <BadgeIcon emoji={badge.emoji} earned={badge.earned} size="lg" />
              </div>
              <div className="text-[11px] font-bold text-dark">
                {badge.name}
              </div>
              <div className="text-[9px] text-brown-dark mt-0.5">
                {badge.desc}
              </div>
              {!badge.earned && badge.progress && (
                <div className="text-[8px] text-brown mt-1">
                  {badge.progress}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 지역별 뱃지 */}
      <div className="px-5 pb-5">
        <h2 className="text-sm font-bold text-dark mb-3.5">📍 지역별 뱃지</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {ALL_REGIONS.map((region) => {
            const earned = earnedRegions.has(region);
            const badge = badges.find(
              (b) => b.badge_type === "regional" && b.statues?.region === region
            );
            return (
              <div
                key={region}
                className={`text-center bg-white rounded-xl p-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)] ${
                  !earned ? "opacity-35" : ""
                }`}
              >
                <div className="mx-auto mb-1.5">
                  <BadgeIcon earned={earned} />
                </div>
                <div className="text-[10px] font-bold text-dark">{region}</div>
                <div className="text-[8px] text-brown mt-0.5">
                  {earned && badge
                    ? new Date(badge.earned_at).toLocaleDateString("ko-KR")
                    : "미방문"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
