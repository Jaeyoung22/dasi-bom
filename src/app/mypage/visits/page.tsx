"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/ui/Header";

interface VisitRecord {
  id: string;
  photo_url: string;
  visited_at: string;
  statues?: { id: string; name: string; address: string; region: string } | null;
}

export default function MyVisitsPage() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<VisitRecord[]>([]);

  useEffect(() => {
    if (!user?.dbId) return;
    fetch(`/api/my-visits?user_id=${user.dbId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVisits(data);
      });
  }, [user?.dbId]);

  return (
    <div>
      <Header title="내 방문 기록" subtitle="다시, 봄" showBack />

      <div className="px-5 py-4">
        {visits.length === 0 ? (
          <div className="text-center text-xs text-brown-dark py-12">
            아직 방문 기록이 없어요. 소녀상을 방문해보세요!
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((v) => (
              <Link
                key={v.id}
                href={v.statues ? `/statues/${v.statues.id}` : "#"}
                className="flex gap-3 bg-white rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              >
                {v.photo_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={v.photo_url}
                    alt="인증 사진"
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-dark truncate">
                    {v.statues?.name || "소녀상"}
                  </div>
                  <div className="text-[10px] text-brown-dark mt-1">
                    📍 {v.statues?.address || ""}
                  </div>
                  <div className="text-[10px] text-brown mt-1">
                    {new Date(v.visited_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="text-xs text-brown-dark self-center">→</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
