import type { InputHTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "form-input",
        className
      )}
      {...props}
    />
  );
}
