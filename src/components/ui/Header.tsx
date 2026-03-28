"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  showBack?: boolean;
}

export default function Header({ title, subtitle, rightElement, showBack }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-gradient-to-b from-dark to-[#3d3128] text-cream px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="text-cream/60 hover:text-cream text-lg transition-colors"
            >
              ←
            </button>
          )}
          <div>
            {subtitle && (
              <div className="text-[10px] tracking-[3px] uppercase opacity-40">
                {subtitle}
              </div>
            )}
            <h1 className="font-title text-xl mt-0.5">{title}</h1>
          </div>
        </div>
        {rightElement}
      </div>
    </header>
  );
}
