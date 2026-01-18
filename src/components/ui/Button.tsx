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
    "bg-gradient-to-br from-accent-purple to-accent-pink text-white shadow-dream-md hover:shadow-dream-lg",
  secondary:
    "bg-accent-purple/10 text-accent-purple border border-accent-purple hover:bg-accent-purple/20",
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
        "rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-dream-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
