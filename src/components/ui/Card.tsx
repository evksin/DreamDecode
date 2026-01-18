import type { HTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-dream bg-bg-dream-800/80 p-5 backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
}
