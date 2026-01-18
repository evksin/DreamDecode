import type { HTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  active?: boolean;
};

export function Badge({ className, active, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-accent-primary bg-accent-primary/20 text-text-primary"
          : "border-border-color text-text-secondary hover:border-accent-primary/60",
        className
      )}
      {...props}
    />
  );
}
