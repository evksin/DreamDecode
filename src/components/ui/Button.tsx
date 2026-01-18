import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-purple text-bg-dream-900 hover:bg-accent-pink shadow-lg",
  secondary:
    "bg-bg-dream-800 text-text-dream-50 border border-border-dream hover:bg-bg-dream-700",
  ghost: "bg-transparent text-text-dream-400 hover:text-text-dream-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm md:text-base",
  lg: "px-6 py-4 text-base md:text-lg",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
