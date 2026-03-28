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
    <header className="bg-dark text-cream px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="text-cream/80 text-lg"
            >
              ←
            </button>
          )}
          <div>
            {subtitle && (
              <div className="text-[11px] tracking-[2px] opacity-70">
                {subtitle}
              </div>
            )}
            <h1 className="text-xl font-bold mt-1">{title}</h1>
          </div>
        </div>
        {rightElement}
      </div>
    </header>
  );
}
