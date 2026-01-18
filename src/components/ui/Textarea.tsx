import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full resize-y rounded-lg border border-border-dream bg-bg-dream-800 px-4 py-3 text-text-dream-50 placeholder:text-text-dream-400 transition-all duration-200 focus:border-accent-purple focus:outline-none focus:shadow-lg focus:shadow-accent-purple/20",
        className
      )}
      {...props}
    />
  );
}
