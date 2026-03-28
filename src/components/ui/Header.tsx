interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export default function Header({ title, subtitle, rightElement }: HeaderProps) {
  return (
    <header className="bg-dark text-cream px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          {subtitle && (
            <div className="text-[11px] tracking-[2px] opacity-70">
              {subtitle}
            </div>
          )}
          <h1 className="text-xl font-bold mt-1">{title}</h1>
        </div>
        {rightElement}
      </div>
    </header>
  );
}
