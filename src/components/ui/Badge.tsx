import type { HTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  active?: boolean;
};

export function Badge({ className, active, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "emotion-chip",
        active ? "active" : undefined,
        className
      )}
      {...props}
    />
  );
}
