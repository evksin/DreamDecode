import type { HTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border-color bg-bg-secondary/80 p-4 backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
}
