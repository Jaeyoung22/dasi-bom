export default function WatercolorBlob({
  className = "",
  color = "#d4a574",
  opacity = 0.08,
  size = 300,
}: {
  className?: string;
  color?: string;
  opacity?: number;
  size?: number;
}) {
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
        <filter id="wc-blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <path
        d="M100 20 C140 25, 175 50, 180 90 C185 130, 160 170, 120 178 C80 186, 30 165, 22 125 C14 85, 60 15, 100 20Z"
        fill={color}
        opacity={opacity}
        filter="url(#wc-blur)"
      />
    </svg>
  );
}
