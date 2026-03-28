export default function BrushStroke({ className = "", color = "#2c2419" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 300 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="brush">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </defs>
      <path
        d="M2 8 C20 4, 40 7, 60 5 C80 3, 100 8, 120 6 C140 4, 160 7, 180 5 C200 3, 220 7, 240 5 C260 3, 280 6, 298 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.15"
        filter="url(#brush)"
      />
    </svg>
  );
}
