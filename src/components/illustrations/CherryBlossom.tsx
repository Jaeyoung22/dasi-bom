"use client";

import { useMemo } from "react";

export default function CherryBlossom({ count = 8 }: { count?: number }) {
  const petals = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 10 + (i * 73 + 17) % 80,
      delay: (i * 1.3) % 6,
      duration: 4 + (i * 0.7) % 4,
      size: 8 + (i * 3) % 12,
      opacity: 0.15 + (i * 0.04) % 0.25,
    })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute petal-fall"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2 C12 5, 16 8, 16 12 C16 16, 12 18, 10 18 C8 18, 4 16, 4 12 C4 8, 8 5, 10 2Z"
              fill="#e8b4b8"
              opacity="0.7"
            />
            <path
              d="M10 4 C11 7, 13 9, 13 12 C13 14, 11 16, 10 16"
              stroke="#d4949a"
              strokeWidth="0.5"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
