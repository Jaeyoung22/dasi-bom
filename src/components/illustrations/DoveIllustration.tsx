export default function DoveIllustration({ className = "", size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 수채화 워시 배경 */}
      <defs>
        <radialGradient id="wash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a574" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#e8dcc8" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#faf5ec" stopOpacity="0" />
        </radialGradient>
        <filter id="watercolor">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#wash)" />

      {/* 비둘기 몸체 — 부드러운 붓 터치 */}
      <g filter="url(#watercolor)" opacity="0.85">
        {/* 몸 */}
        <path
          d="M90 130 C70 125, 55 110, 58 95 C60 82, 72 72, 88 70 C95 69, 105 72, 108 78 C112 85, 110 95, 105 105 C100 115, 95 125, 90 130Z"
          fill="#8b7355"
          opacity="0.6"
        />
        {/* 날개 위 */}
        <path
          d="M88 75 C75 60, 55 45, 35 42 C45 50, 55 58, 65 68 C72 72, 80 74, 88 75Z"
          fill="#a08968"
          opacity="0.5"
        />
        {/* 날개 아래 */}
        <path
          d="M85 80 C70 70, 48 55, 30 55 C42 62, 55 70, 68 78 C74 80, 80 80, 85 80Z"
          fill="#b8a080"
          opacity="0.4"
        />
        {/* 머리 */}
        <circle cx="108" cy="76" r="10" fill="#7a6348" opacity="0.55" />
        {/* 부리 */}
        <path d="M117 74 L125 76 L117 78Z" fill="#c4956a" opacity="0.6" />
        {/* 눈 */}
        <circle cx="111" cy="74" r="1.5" fill="#2c2419" opacity="0.7" />
        {/* 꼬리 */}
        <path
          d="M70 125 C60 135, 50 145, 42 155 C55 148, 65 138, 72 128Z"
          fill="#a08968"
          opacity="0.35"
        />
      </g>

      {/* 올리브 가지 */}
      <g opacity="0.6">
        <path d="M118 78 C125 82, 135 85, 145 83" stroke="#6b8f5e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="132" cy="80" rx="5" ry="3" fill="#7da36e" opacity="0.5" transform="rotate(-15 132 80)" />
        <ellipse cx="140" cy="82" rx="4" ry="2.5" fill="#8bb87a" opacity="0.4" transform="rotate(-10 140 82)" />
        <ellipse cx="138" cy="85" rx="4.5" ry="2.5" fill="#7da36e" opacity="0.45" transform="rotate(10 138 85)" />
      </g>
    </svg>
  );
}
