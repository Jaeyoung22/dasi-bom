"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface PostData {
  id: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
  users?: { nickname: string; avatar_url: string | null };
}

interface CommentData {
  id: string;
  content: string;
  created_at: string;
  users?: { nickname: string; avatar_url: string | null };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function PostCard({ post }: { post: PostData }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 좋아요 상태 확인
  useEffect(() => {
    if (!user?.dbId) return;
    fetch(`/api/likes?user_id=${user.dbId}&post_id=${post.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.liked !== undefined) setLiked(data.liked);
      })
      .catch(() => {});
  }, [user?.dbId, post.id]);

  const handleLike = async () => {
    if (!user?.dbId) return;
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.dbId, post_id: post.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount((prev) => (data.liked ? prev + 1 : Math.max(prev - 1, 0)));
    }
  };

  const loadComments = async () => {
    const res = await fetch(`/api/comments?post_id=${post.id}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
    }
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!user?.dbId || !newComment.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: post.id,
        user_id: user.dbId,
        content: newComment,
      }),
    });
    if (res.ok) {
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex gap-2 items-center mb-2">
        <div className="w-7 h-7 rounded-full bg-beige" />
        <div>
          <div className="text-xs font-semibold text-dark">
            {post.users?.nickname || "익명"}
          </div>
          <div className="text-[10px] text-brown-dark">
            {timeAgo(post.created_at)} ·{" "}
            <span className="bg-surface-muted px-1.5 py-0.5 rounded-lg">
              {post.category === "status_report" ? "상태보고" : "방문소감"}
            </span>
          </div>
        </div>
      </div>
      <div className="text-xs text-dark leading-relaxed">{post.content}</div>

      {/* 좋아요 + 댓글 버튼 */}
      <div className="flex gap-4 mt-2.5">
        <button
          onClick={handleLike}
          className={`text-[11px] ${liked ? "text-red-500" : "text-brown-dark"}`}
        >
          {liked ? "❤️" : "🤍"} {likesCount}
        </button>
        <button
          onClick={toggleComments}
          className="text-[11px] text-brown-dark"
        >
          💬 댓글
        </button>
      </div>

      {/* 댓글 영역 */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-surface-muted">
          {comments.length === 0 && (
            <div className="text-[10px] text-brown-dark mb-2">
              아직 댓글이 없어요
            </div>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-beige shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-dark">
                  {c.users?.nickname || "익명"}
                </span>
                <span className="text-[10px] text-brown-dark ml-1.5">
                  {timeAgo(c.created_at)}
                </span>
                <div className="text-[11px] text-dark mt-0.5">{c.content}</div>
              </div>
            </div>
          ))}

          {/* 댓글 입력 */}
          {user && (
            <div className="flex gap-2 mt-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글 작성..."
                className="flex-1 text-[11px] border border-beige rounded-lg px-2.5 py-1.5 outline-none focus:border-brown"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                className="text-[11px] font-semibold text-brown disabled:opacity-40 shrink-0"
              >
                등록
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
