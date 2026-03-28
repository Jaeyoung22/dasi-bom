interface BadgeIconProps {
  emoji?: string;
  earned: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-10 h-10 text-lg",
  md: "w-12 h-12 text-[22px]",
  lg: "w-14 h-14 text-[28px]",
};

export default function BadgeIcon({
  emoji = "🕊️",
  earned,
  size = "md",
}: BadgeIconProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center ${
        earned
          ? "bg-gradient-to-br from-brown to-brown-dark"
          : "bg-beige opacity-40"
      }`}
    >
      {earned ? emoji : "❓"}
    </div>
  );
}
