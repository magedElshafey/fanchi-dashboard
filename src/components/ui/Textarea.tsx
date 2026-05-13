import React from "react";
import { cn } from "../../lib/cn";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export default function Textarea({ label, error, hint, className, ...props }: Props) {
  return (
    <label className="block space-y-1">
      {label ? <span className="label">{label}</span> : null}
      <textarea className={cn("input min-h-[110px] resize-y", className, error && "border-[var(--danger)]")} {...props} />
      {error ? <span className="text-xs text-[var(--danger)]">{error}</span> : null}
      {!error && hint ? <span className="help">{hint}</span> : null}
    </label>
  );
}
