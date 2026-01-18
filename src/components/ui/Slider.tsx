import type { InputHTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type SliderProps = InputHTMLAttributes<HTMLInputElement>;

export function Slider({ className, ...props }: SliderProps) {
  return (
    <input
      type="range"
      className={cn(
        "form-input",
        className
      )}
      {...props}
    />
  );
}
