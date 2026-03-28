interface StatsCardProps {
  visitCount: number;
  badgeCount: number;
  rank: number | null;
}

export default function StatsCard({
  visitCount,
  badgeCount,
  rank,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="text-xs text-brown-dark font-semibold mb-3">
        나의 발자취
      </div>
      <div className="flex justify-around text-center">
        <div>
          <div className="text-[28px] font-extrabold text-dark">
            {visitCount}
          </div>
          <div className="text-[11px] text-brown-dark">방문한 소녀상</div>
        </div>
        <div className="w-px bg-beige" />
        <div>
          <div className="text-[28px] font-extrabold text-brown">
            {badgeCount}
          </div>
          <div className="text-[11px] text-brown-dark">획득한 봄</div>
        </div>
        <div className="w-px bg-beige" />
        <div>
          <div className="text-[28px] font-extrabold text-dark">
            {rank ? `${rank}위` : "-"}
          </div>
          <div className="text-[11px] text-brown-dark">전체 랭킹</div>
        </div>
      </div>
    </div>
  );
}
