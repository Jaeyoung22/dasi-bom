"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";

export default function NotificationsPage() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [badgeAlert, setBadgeAlert] = useState(true);
  const [commentAlert, setCommentAlert] = useState(true);

  return (
    <div>
      <Header title="알림 설정" subtitle="다시, 봄" showBack />

      <div className="px-5 py-4 space-y-1">
        {[
          { label: "푸시 알림", desc: "새로운 소식을 알려드려요", value: pushEnabled, onChange: setPushEnabled },
          { label: "뱃지 획득 알림", desc: "새 뱃지를 획득하면 알려드려요", value: badgeAlert, onChange: setBadgeAlert },
          { label: "댓글 알림", desc: "내 글에 댓글이 달리면 알려드려요", value: commentAlert, onChange: setCommentAlert },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="text-sm font-semibold text-dark">{item.label}</div>
              <div className="text-[11px] text-brown-dark mt-0.5">{item.desc}</div>
            </div>
            <button
              onClick={() => item.onChange(!item.value)}
              className={`w-11 h-6 rounded-full transition-colors ${item.value ? "bg-brown" : "bg-beige"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? "translate-x-5.5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="px-5 mt-4">
        <p className="text-[10px] text-brown-dark">
          알림 설정은 현재 기기에만 적용됩니다. 푸시 알림은 추후 지원 예정입니다.
        </p>
      </div>
    </div>
  );
}
