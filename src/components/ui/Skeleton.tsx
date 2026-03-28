export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-beige rounded-lg ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] space-y-3">
      <div className="flex gap-3 items-center">
        <Skeleton className="w-12 h-12 rounded-[10px]" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="bg-white rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] space-y-2.5">
      <div className="flex gap-2 items-center">
        <Skeleton className="w-7 h-7 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
