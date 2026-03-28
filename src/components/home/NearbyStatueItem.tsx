import Link from "next/link";

interface NearbyStatueItemProps {
  id: string;
  name: string;
  address: string;
  distance: string;
}

export default function NearbyStatueItem({
  id,
  name,
  address,
  distance,
}: NearbyStatueItemProps) {
  return (
    <Link href={`/statues/${id}`}>
      <div className="bg-surface rounded-xl p-3.5 border border-border/40 flex gap-3 items-center card-hover">
        <div className="w-[46px] h-[46px] rounded-xl bg-gradient-to-br from-surface-muted to-beige flex items-center justify-center text-xl shrink-0">
          🕊️
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-dark truncate">{name}</div>
          <div className="text-[10px] text-brown-dark/70 mt-1 truncate">
            {address}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[11px] font-semibold text-brown">{distance}</div>
          <div className="text-[9px] text-brown-dark/50 mt-0.5">거리</div>
        </div>
      </div>
    </Link>
  );
}
