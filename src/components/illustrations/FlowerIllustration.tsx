export default function FlowerIllustration({ className = "", size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="fl-wash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8b4b8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#faf5ec" stopOpacity="0" />
        </radialGradient>
        <filter id="fl-soft">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>

      {/* 배경 워시 */}
      <circle cx="100" cy="100" r="90" fill="url(#fl-wash)" />

      {/* 꽃잎 5장 — 수채화 스타일 */}
      <g opacity="0.75" filter="url(#fl-soft)">
        {/* 꽃잎 1 (위) */}
        <path d="M100 45 C108 55, 118 65, 118 80 C118 90, 108 95, 100 95 C92 95, 82 90, 82 80 C82 65, 92 55, 100 45Z"
          fill="#e8a0a8" opacity="0.6" />
        <path d="M100 50 C105 58, 112 67, 112 78 C112 85, 106 90, 100 90"
          stroke="#d4848e" strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* 꽃잎 2 (오른쪽 위) */}
        <path d="M130 60 C135 72, 138 85, 130 97 C124 106, 112 108, 105 102 C98 96, 98 84, 103 74 C108 64, 122 55, 130 60Z"
          fill="#ebb0b5" opacity="0.5" />

        {/* 꽃잎 3 (오른쪽 아래) */}
        <path d="M135 100 C138 112, 132 126, 120 132 C110 137, 100 132, 97 124 C94 116, 98 105, 108 98 C118 91, 130 92, 135 100Z"
          fill="#e8a0a8" opacity="0.55" />

        {/* 꽃잎 4 (왼쪽 아래) */}
        <path d="M65 100 C62 112, 68 126, 80 132 C90 137, 100 132, 103 124 C106 116, 102 105, 92 98 C82 91, 70 92, 65 100Z"
          fill="#ebb0b5" opacity="0.5" />

        {/* 꽃잎 5 (왼쪽 위) */}
        <path d="M70 60 C65 72, 62 85, 70 97 C76 106, 88 108, 95 102 C102 96, 102 84, 97 74 C92 64, 78 55, 70 60Z"
          fill="#e8a0a8" opacity="0.55" />
      </g>

      {/* 꽃 중심 */}
      <circle cx="100" cy="97" r="12" fill="#d4949a" opacity="0.35" />
      <circle cx="100" cy="97" r="7" fill="#c47880" opacity="0.3" />
      <circle cx="100" cy="97" r="3" fill="#b86068" opacity="0.25" />

      {/* 수술 점들 */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <circle
          key={deg}
          cx={100 + Math.cos((deg * Math.PI) / 180) * 9}
          cy={97 + Math.sin((deg * Math.PI) / 180) * 9}
          r="1"
          fill="#c47880"
          opacity="0.4"
        />
      ))}

      {/* 줄기 */}
      <path d="M100 110 C100 125, 98 145, 95 165" stroke="#7da36e" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round" />

      {/* 잎 */}
      <path d="M97 135 C88 130, 78 128, 72 132 C78 135, 88 136, 97 135Z" fill="#8bb87a" opacity="0.3" />
      <path d="M98 148 C107 144, 115 140, 120 143 C114 146, 106 148, 98 148Z" fill="#7da36e" opacity="0.25" />
    </svg>
  );
}
