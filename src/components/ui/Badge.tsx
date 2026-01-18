import type { HTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  active?: boolean;
};

export function Badge({ className, active, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-2 text-xs transition-all duration-200",
        active
          ? "border-accent-purple bg-accent-purple text-bg-dream-900 font-semibold"
          : "border-border-dream bg-bg-dream-800 text-text-dream-400 hover:border-accent-purple",
        className
      )}
      {...props}
    />
  );
}
