"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface RankUser {
  id: string;
  nickname: string;
  avatar_url: string | null;
  total_badges: number;
  created_at: string;
}

const tabs = ["전체", "이번 달", "지역별"];
const ALL_REGIONS = [
  "서울", "경기", "인천", "부산", "대전", "대구",
  "울산", "광주", "세종", "강원", "충남", "충북",
  "전북", "전남", "경북", "경남", "제주",
];

export default function RankingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("전체");
  const [users, setUsers] = useState<RankUser[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("서울");

  useEffect(() => {
    let url = `/api/ranking?tab=${encodeURIComponent(activeTab)}`;
    if (activeTab === "지역별") url += `&region=${encodeURIComponent(selectedRegion)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else setUsers([]);
      })
      .catch(() => setUsers([]));
  }, [activeTab, selectedRegion]);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  // TOP3를 포디움 순서로 재배열 (2위, 1위, 3위)
  const podium = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  // 내 순위 계산
  const myRankIndex = user ? users.findIndex((u) => u.id === user.dbId) : -1;
  const myRank = myRankIndex >= 0 ? myRankIndex + 1 : null;
  const myData = myRank ? users[myRankIndex] : null;

  return (
    <div className="pb-20">
      {/* 헤더 */}
      <div className="bg-dark text-cream px-5 pt-5 pb-14">
        <div className="text-[11px] tracking-[2px] opacity-70">다시, 봄</div>
        <h1 className="text-xl font-bold mt-1">봄을 되찾는 사람들</h1>
      </div>

      {/* 탭 */}
      <div className="flex bg-white mx-5 -mt-10 rounded-t-xl overflow-hidden shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-3.5 text-[13px] ${
              activeTab === tab
                ? "font-bold text-dark border-b-2 border-brown"
                : "text-brown-dark"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 지역 선택 */}
      {activeTab === "지역별" && (
        <div className="bg-white mx-5 px-4 pt-3 pb-2 border-b border-surface-muted">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {ALL_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1.5 rounded-2xl text-[10px] font-semibold whitespace-nowrap ${
                  selectedRegion === r
                    ? "bg-dark text-cream"
                    : "bg-surface-muted text-brown-dark"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <div className="bg-white mx-5 rounded-b-xl p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-sm font-semibold text-dark">아직 랭킹이 없어요</p>
          <p className="text-xs text-brown-dark mt-2">
            소녀상을 방문하고 첫 번째 봄을 되찾아보세요!
          </p>
        </div>
      ) : (
        <>
          {/* TOP 3 포디움 */}
          {top3.length >= 3 && (
            <div className="bg-white mx-5 px-4 py-6 border-b border-beige">
              <div className="flex items-end justify-center gap-3">
                {podium.map((u, i) => {
                  const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                  const isFirst = actualRank === 1;
                  const heights: Record<number, string> = { 1: "h-[70px]", 2: "h-[50px]", 3: "h-[36px]" };
                  const avatarSize = isFirst ? "w-16 h-16" : "w-[52px] h-[52px]";
                  const borderColor = isFirst
                    ? "border-brown"
                    : actualRank === 2 ? "border-gray-400" : "border-amber-700";
                  const podiumBg = isFirst
                    ? "from-[#dbb778] to-brown"
                    : actualRank === 2 ? "from-gray-300 to-gray-400" : "from-[#d4a574] to-amber-700";

                  return (
                    <div key={u.id} className="text-center" style={{ width: isFirst ? 100 : 90 }}>
                      {isFirst && <div className="text-lg mb-1">👑</div>}
                      <div className={`${avatarSize} rounded-full bg-beige mx-auto mb-1.5 flex items-center justify-center text-sm font-extrabold text-dark border-2 ${borderColor}`}>
                        🌸
                      </div>
                      <div className={`text-xs font-bold text-dark ${isFirst ? "text-sm font-extrabold" : ""}`}>
                        {u.nickname}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isFirst ? "text-brown font-semibold" : "text-brown-dark"}`}>
                        {u.total_badges}개의 봄
                      </div>
                      <div className={`bg-gradient-to-b ${podiumBg} text-white text-[11px] font-extrabold py-2 rounded-t-lg mt-2 ${heights[actualRank]} flex items-center justify-center`}>
                        {actualRank === 1 ? "1st" : actualRank === 2 ? "2nd" : "3rd"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 나머지 순위 */}
          <div className="bg-white mx-5 rounded-b-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            {rest.map((u, i) => (
              <div
                key={u.id}
                className={`flex items-center px-4 py-3.5 ${
                  i < rest.length - 1 ? "border-b border-surface-muted" : ""
                } ${u.id === user?.dbId ? "bg-brown/5" : ""}`}
              >
                <div className="w-7 text-sm font-extrabold text-brown-dark">
                  {i + 4}
                </div>
                <div className="w-9 h-9 rounded-full bg-beige mr-3 flex items-center justify-center text-sm">
                  🌸
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-dark">
                    {u.nickname}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-dark">
                    {u.total_badges}
                  </div>
                  <div className="text-[9px] text-brown-dark">개의 봄</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 내 순위 고정 바 */}
      {user && (
        <div className="fixed bottom-16 left-0 right-0 max-w-[430px] mx-auto bg-dark text-cream px-5 py-3 flex items-center shadow-[0_-2px_8px_rgba(0,0,0,0.15)] z-10">
          <div className="w-8 h-8 rounded-full bg-brown mr-3 flex items-center justify-center text-sm">
            🌸
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">{user.nickname}</div>
            <div className="text-[10px] opacity-70">
              {myRank ? `${myRank}위` : "순위 없음"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-extrabold">
              {myData?.total_badges || 0}
            </div>
            <div className="text-[9px] opacity-70">개의 봄</div>
          </div>
        </div>
      )}
    </div>
  );
}
