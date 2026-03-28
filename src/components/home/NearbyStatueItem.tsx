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
      <div className="bg-white rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex gap-3 items-center">
        <div className="w-[50px] h-[50px] rounded-[10px] bg-beige flex items-center justify-center text-2xl shrink-0">
          🕊️
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-dark truncate">{name}</div>
          <div className="text-[11px] text-brown-dark mt-0.5 truncate">
            {address} · {distance}
          </div>
        </div>
        <div className="text-[11px] text-brown font-semibold shrink-0">→</div>
      </div>
    </Link>
  );
}
