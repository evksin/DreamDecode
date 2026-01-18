import type { InputHTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type SliderProps = InputHTMLAttributes<HTMLInputElement>;

export function Slider({ className, ...props }: SliderProps) {
  return (
    <input
      type="range"
      className={cn(
        "w-full cursor-pointer accent-accent-purple",
        className
      )}
      {...props}
    />
  );
}
