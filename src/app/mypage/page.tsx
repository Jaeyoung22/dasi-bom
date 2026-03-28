"use client";

import { useAuth } from "@/lib/auth-context";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";

export default function MyPage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-brown-dark text-sm">
        로딩 중...
      </div>
    );
  }

  return (
    <div>
      <Header title="마이페이지" subtitle="다시, 봄" />

      {user ? (
        <>
          {/* 로그인 상태 */}
          <div className="px-5 py-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brown flex items-center justify-center text-2xl overflow-hidden">
              {user.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.avatarUrl}
                  alt={user.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                "👤"
              )}
            </div>
            <div>
              <div className="text-lg font-bold text-dark">
                {user.nickname}
              </div>
              <div className="text-xs text-brown-dark mt-1">
                소녀상을 방문하고 봄을 모아보세요
              </div>
            </div>
          </div>

          <div className="mt-2">
            {[
              { label: "내 방문 기록", icon: "📸" },
              { label: "내가 쓴 글", icon: "📝" },
              { label: "좋아요한 글", icon: "❤️" },
              { label: "알림 설정", icon: "🔔" },
              { label: "앱 정보", icon: "ℹ️" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-5 py-4 border-b border-border text-left"
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-dark">{item.label}</span>
                <span className="ml-auto text-brown-dark text-xs">→</span>
              </button>
            ))}
          </div>

          <div className="px-5 mt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={signOut}
            >
              로그아웃
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* 비로그인 상태 */}
          <div className="px-5 py-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brown flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <div className="text-lg font-bold text-dark">
                로그인이 필요합니다
              </div>
              <div className="text-xs text-brown-dark mt-1">
                소녀상을 방문하고 봄을 모아보세요
              </div>
            </div>
          </div>

          <div className="px-5">
            <Button
              fullWidth
              onClick={() => (window.location.href = "/login")}
            >
              로그인하기
            </Button>
          </div>

          <div className="mt-6">
            {[
              { label: "앱 정보", icon: "ℹ️" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-5 py-4 border-b border-border text-left"
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-dark">{item.label}</span>
                <span className="ml-auto text-brown-dark text-xs">→</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
