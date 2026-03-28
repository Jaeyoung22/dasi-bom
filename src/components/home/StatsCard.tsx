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
    <div className="relative bg-surface rounded-2xl p-5 shadow-[0_8px_32px_rgba(44,36,25,0.12)] border border-white/60 animate-fade-in overflow-hidden">
      {/* 종이 질감 배경 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(44,36,25,0.08) 28px, rgba(44,36,25,0.08) 29px)`
      }} />

      <div className="relative">
        <div className="text-[9px] tracking-[3px] uppercase text-brown-dark/40 font-medium mb-5">
          나의 발자취
        </div>
        <div className="flex justify-around text-center">
          <StatItem value={String(visitCount)} label="방문한 소녀상" highlight={false} />
          <div className="w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" />
          <StatItem value={String(badgeCount)} label="획득한 봄" highlight={true} />
          <div className="w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" />
          <StatItem value={rank ? String(rank) : "—"} label={rank ? "전체 랭킹" : "랭킹 없음"} highlight={false} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ value, label, highlight }: { value: string; label: string; highlight: boolean }) {
  return (
    <div className="flex-1">
      <div className={`font-title text-[32px] leading-none ${highlight ? "text-brown" : "text-dark"}`}>
        {value}
      </div>
      <div className="text-[9px] text-brown-dark/50 mt-2 tracking-[1px]">{label}</div>
    </div>
  );
}
