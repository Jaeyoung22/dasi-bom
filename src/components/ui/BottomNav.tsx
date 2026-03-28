"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/map", label: "지도", icon: "🗺️" },
  { href: "/badges", label: "뱃지", icon: "🏅" },
  { href: "/ranking", label: "랭킹", icon: "🏆" },
  { href: "/mypage", label: "MY", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border/50 z-50">
      <div className="max-w-[430px] mx-auto flex justify-around py-2 px-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center py-1 px-3 rounded-xl text-[10px] transition-all duration-200 ${
                isActive
                  ? "text-dark"
                  : "text-brown-dark/50 hover:text-brown-dark"
              }`}
            >
              {isActive && (
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-brown rounded-full" />
              )}
              <span className={`text-lg mb-0.5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                {tab.icon}
              </span>
              <span className={`tracking-wide ${isActive ? "font-semibold" : ""}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
