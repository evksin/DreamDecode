import type { InputHTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border-dream bg-bg-dream-800 px-4 py-3 text-text-dream-50 placeholder:text-text-dream-400 transition-all duration-200 focus:border-accent-purple focus:outline-none focus:shadow-lg focus:shadow-accent-purple/20",
        className
      )}
      {...props}
    />
  );
}
