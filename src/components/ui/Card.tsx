interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
