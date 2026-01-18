import type { InputHTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border-color bg-bg-primary/60 px-4 py-3 text-text-primary placeholder:text-text-secondary focus:border-accent-primary focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
