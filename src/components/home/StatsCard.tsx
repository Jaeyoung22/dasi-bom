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
    <div className="bg-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(44,36,25,0.08)] border border-border/50 animate-fade-in">
      <div className="text-[10px] tracking-[2px] uppercase text-brown-dark/60 font-semibold mb-4">
        나의 발자취
      </div>
      <div className="flex justify-around text-center">
        <div className="flex-1">
          <div className="font-title text-[30px] text-dark leading-none">
            {visitCount}
          </div>
          <div className="text-[10px] text-brown-dark mt-1.5 tracking-wide">방문한 소녀상</div>
        </div>
        <div className="w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="flex-1">
          <div className="font-title text-[30px] text-brown leading-none">
            {badgeCount}
          </div>
          <div className="text-[10px] text-brown-dark mt-1.5 tracking-wide">획득한 봄</div>
        </div>
        <div className="w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="flex-1">
          <div className="font-title text-[30px] text-dark leading-none">
            {rank ? `${rank}` : "—"}
          </div>
          <div className="text-[10px] text-brown-dark mt-1.5 tracking-wide">
            {rank ? "전체 랭킹" : "랭킹 없음"}
          </div>
        </div>
      </div>
    </div>
  );
}
