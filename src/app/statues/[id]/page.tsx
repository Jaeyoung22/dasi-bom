"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PhotoUpload from "@/components/ui/PhotoUpload";
import { useAuth } from "@/lib/auth-context";
import { useUserLocation } from "@/lib/hooks";
import { uploadPhoto } from "@/lib/storage";
import {
  calculateDistance,
  formatDistance,
  isWithinVerificationRange,
} from "@/lib/geo";

interface StatueDetail {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  installed_date: string | null;
  description: string | null;
}

interface PostData {
  id: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
  users?: { nickname: string; avatar_url: string | null };
}

interface VisitorData {
  id: string;
  photo_url: string;
  visited_at: string;
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

export default function StatueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [statue, setStatue] = useState<StatueDetail | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "visitors">("posts");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [showVerify, setShowVerify] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    success: boolean;
    badgeName?: string;
  } | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<string>("impression");
  const [showPostForm, setShowPostForm] = useState(false);
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const { location } = useUserLocation();

  useEffect(() => {
    fetch(`/api/statues/${id}`)
      .then((res) => res.json())
      .then((data) => setStatue(data));
  }, [id]);

  // 방문자 로드
  useEffect(() => {
    fetch(`/api/visits?statue_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVisitors(data);
      });
  }, [id]);

  // 게시글 로드
  useEffect(() => {
    const cat = categoryFilter === "전체" ? "" : `&category=${categoryFilter === "상태보고" ? "status_report" : "impression"}`;
    fetch(`/api/posts?statue_id=${id}${cat}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      });
  }, [id, categoryFilter]);

  const handleSubmitPost = async () => {
    if (!user?.dbId) {
      router.push("/login");
      return;
    }
    if (!newPostContent.trim()) return;
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user?.dbId || "",
        statue_id: id,
        content: newPostContent,
        category: newPostCategory,
      }),
    });
    if (res.ok) {
      const post = await res.json();
      setPosts((prev) => [post, ...prev]);
      setNewPostContent("");
      setShowPostForm(false);
    }
  };

  if (!statue) {
    return (
      <div className="flex items-center justify-center h-screen text-brown-dark text-sm">
        불러오는 중...
      </div>
    );
  }

  const distance =
    location && statue.latitude
      ? calculateDistance(
          location.lat,
          location.lng,
          statue.latitude,
          statue.longitude
        )
      : null;

  const canVerify =
    location && statue.latitude
      ? isWithinVerificationRange(
          location.lat,
          location.lng,
          statue.latitude,
          statue.longitude
        )
      : false;

  const handleVerify = async () => {
    if (!user?.dbId) {
      router.push("/login");
      return;
    }
    if (!photoFile) return;
    setUploading(true);
    try {
      const photoUrl = await uploadPhoto(photoFile, `visits/${id}`);

      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.dbId,
          statue_id: id,
          photo_url: photoUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setVerifyResult({
          success: true,
          badgeName: data.badge?.badge_name,
        });
      } else {
        setVerifyResult({ success: false });
      }
    } catch {
      setVerifyResult({ success: false });
    }
    setUploading(false);
  };

  return (
    <div>
      {/* 소녀상 이미지 */}
      <div className="bg-gradient-to-b from-[#d4c4a8] to-beige h-[200px] relative flex items-center justify-center">
        <div className="text-[80px] opacity-60">🕊️</div>
        <Link
          href="/"
          className="absolute top-3 left-3 bg-dark/60 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm"
        >
          ←
        </Link>
        {distance !== null && (
          <div className="absolute top-3 right-3 bg-brown text-white px-3 py-1 rounded-full text-[11px] font-semibold">
            {formatDistance(distance)}
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="px-5 py-5">
        <h1 className="text-lg font-extrabold text-dark">{statue.name}</h1>
        <p className="text-xs text-brown-dark mt-1.5">📍 {statue.address}</p>
        {statue.installed_date && (
          <p className="text-xs text-brown-dark mt-1">
            📅 {statue.installed_date} 설치
          </p>
        )}
        {statue.description && (
          <p className="text-[13px] text-brown-deep mt-3.5 leading-relaxed">
            {statue.description}
          </p>
        )}

        {/* 인증 버튼 */}
        {!showVerify && !verifyResult && (
          <>
            <Button
              fullWidth
              className="mt-4"
              variant={canVerify ? "primary" : "secondary"}
              disabled={!canVerify}
              onClick={() => setShowVerify(true)}
            >
              {canVerify
                ? "📸 이 소녀상 방문 인증하기"
                : `📸 인증하기 (${distance !== null ? formatDistance(distance) + " 거리" : "위치 확인 중..."})`}
            </Button>
            <p className="text-center text-[11px] text-brown-dark mt-1.5">
              {canVerify
                ? "인증 가능 범위 안에 있습니다!"
                : "반경 100m 이내에서만 인증 가능합니다"}
            </p>
          </>
        )}

        {/* 인증 사진 업로드 */}
        {showVerify && !verifyResult && (
          <div className="mt-4 space-y-3">
            <PhotoUpload
              onPhotoSelected={(file, _preview) => setPhotoFile(file)}
              disabled={uploading}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowVerify(false);
                  setPhotoFile(null);
                }}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                disabled={!photoFile || uploading}
                onClick={handleVerify}
              >
                {uploading ? "업로드 중..." : "인증하기"}
              </Button>
            </div>
          </div>
        )}

        {/* 인증 결과 */}
        {verifyResult && (
          <div className="mt-4 text-center bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            {verifyResult.success ? (
              <>
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-lg font-bold text-dark">
                  방문 인증 완료!
                </h3>
                {verifyResult.badgeName && (
                  <p className="text-sm text-brown mt-2">
                    🏅 &quot;{verifyResult.badgeName}&quot; 뱃지를 획득했어요!
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="text-5xl mb-3">😢</div>
                <h3 className="text-lg font-bold text-dark">
                  인증에 실패했어요
                </h3>
                <p className="text-sm text-brown-dark mt-2">
                  다시 시도해주세요
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* 탭 */}
      <div className="flex border-b-2 border-beige">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 text-center py-3 text-[13px] font-bold ${
            activeTab === "posts"
              ? "text-dark border-b-2 border-dark -mb-[2px]"
              : "text-brown-dark"
          }`}
        >
          게시판
        </button>
        <button
          onClick={() => setActiveTab("visitors")}
          className={`flex-1 text-center py-3 text-[13px] ${
            activeTab === "visitors"
              ? "text-dark border-b-2 border-dark -mb-[2px] font-bold"
              : "text-brown-dark"
          }`}
        >
          방문자
        </button>
      </div>

      {activeTab === "posts" && (
        <div className="px-5 py-4">
          {/* 글 작성 */}
          {!showPostForm ? (
            <button
              onClick={() => setShowPostForm(true)}
              className="w-full bg-white rounded-xl p-3 mb-3.5 flex gap-2.5 items-center shadow-[0_1px_4px_rgba(0,0,0,0.04)] text-left"
            >
              <div className="w-8 h-8 rounded-full bg-brown shrink-0" />
              <div className="flex-1 text-[13px] text-brown-dark/60">
                이 소녀상에 대한 글을 남겨주세요...
              </div>
              <div className="text-base">📝</div>
            </button>
          ) : (
            <div className="bg-white rounded-xl p-4 mb-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setNewPostCategory("impression")}
                  className={`px-3 py-1.5 rounded-2xl text-[10px] font-semibold ${
                    newPostCategory === "impression"
                      ? "bg-dark text-cream"
                      : "bg-surface-muted text-brown-dark"
                  }`}
                >
                  방문소감
                </button>
                <button
                  onClick={() => setNewPostCategory("status_report")}
                  className={`px-3 py-1.5 rounded-2xl text-[10px] font-semibold ${
                    newPostCategory === "status_report"
                      ? "bg-dark text-cream"
                      : "bg-surface-muted text-brown-dark"
                  }`}
                >
                  상태보고
                </button>
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="글을 작성해주세요..."
                className="w-full h-24 text-sm border border-beige rounded-lg p-3 resize-none outline-none focus:border-brown"
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 !py-2 !text-xs"
                  onClick={() => {
                    setShowPostForm(false);
                    setNewPostContent("");
                  }}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 !py-2 !text-xs"
                  disabled={!newPostContent.trim()}
                  onClick={handleSubmitPost}
                >
                  작성
                </Button>
              </div>
            </div>
          )}

          {/* 카테고리 필터 */}
          <div className="flex gap-1.5 mb-3.5">
            {["전체", "상태보고", "방문소감"].map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-2xl text-[10px] font-semibold ${
                  categoryFilter === c
                    ? "bg-dark text-cream"
                    : "bg-surface-muted text-brown-dark"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-2.5">
            {posts.length === 0 && (
              <div className="text-center text-xs text-brown-dark py-8">
                아직 게시글이 없어요. 첫 번째 글을 남겨보세요!
              </div>
            )}
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              >
                <div className="flex gap-2 items-center mb-2">
                  <div className="w-7 h-7 rounded-full bg-beige" />
                  <div>
                    <div className="text-xs font-semibold text-dark">
                      {post.users?.nickname || "익명"}
                    </div>
                    <div className="text-[10px] text-brown-dark">
                      {timeAgo(post.created_at)} ·{" "}
                      <span className="bg-surface-muted px-1.5 py-0.5 rounded-lg">
                        {post.category === "status_report"
                          ? "상태보고"
                          : "방문소감"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-dark leading-relaxed">
                  {post.content}
                </div>
                <div className="text-[11px] text-brown-dark mt-2">
                  ❤️ {post.likes_count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "visitors" && (
        <div className="px-5 py-4">
          {visitors.length === 0 ? (
            <div className="text-center text-xs text-brown-dark py-8">
              아직 방문 인증이 없어요. 첫 번째 방문자가 되어보세요!
            </div>
          ) : (
            <div className="space-y-2.5">
              {visitors.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex gap-3 items-center"
                >
                  <div className="w-9 h-9 rounded-full bg-beige flex items-center justify-center text-sm shrink-0">
                    🌸
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-dark">
                      {v.users?.nickname || "익명"}
                    </div>
                    <div className="text-[10px] text-brown-dark">
                      {new Date(v.visited_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  {v.photo_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={v.photo_url}
                      alt="인증 사진"
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
