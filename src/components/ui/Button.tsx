interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base = "rounded-xl font-semibold text-sm py-3 px-5 transition-colors";
  const variants = {
    primary: "bg-dark text-cream hover:bg-brown-deep",
    secondary: "bg-brown text-cream hover:bg-brown-dark",
    outline: "border-2 border-dark text-dark hover:bg-dark hover:text-cream",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
