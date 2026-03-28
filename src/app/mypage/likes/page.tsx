"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/ui/Header";

interface LikedPost {
  id: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
  users?: { nickname: string; avatar_url: string | null } | null;
}

export default function MyLikesPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<LikedPost[]>([]);

  useEffect(() => {
    if (!user?.dbId) return;
    fetch(`/api/my-likes?user_id=${user.dbId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      });
  }, [user?.dbId]);

  return (
    <div>
      <Header title="좋아요한 글" subtitle="다시, 봄" showBack />

      <div className="px-5 py-4">
        {posts.length === 0 ? (
          <div className="text-center text-xs text-brown-dark py-12">
            아직 좋아요한 글이 없어요
          </div>
        ) : (
          <div className="space-y-2.5">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              >
                <div className="flex gap-2 items-center mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-beige" />
                  <span className="text-[11px] font-semibold text-dark">
                    {post.users?.nickname || "익명"}
                  </span>
                  <span className="text-[10px] text-brown-dark">
                    {post.category === "status_report" ? "상태보고" : "방문소감"}
                  </span>
                </div>
                <div className="text-xs text-dark leading-relaxed line-clamp-3">
                  {post.content}
                </div>
                <div className="flex gap-3 mt-2 text-[10px] text-brown-dark">
                  <span>❤️ {post.likes_count}</span>
                  <span>
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
