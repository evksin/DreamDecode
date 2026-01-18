import type { HTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border-dream bg-bg-dream-700/40 p-6 backdrop-blur-md shadow-dream-sm",
        className
      )}
      {...props}
    />
  );
}
