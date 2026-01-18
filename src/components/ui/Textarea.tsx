import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "form-textarea",
        className
      )}
      {...props}
    />
  );
}
