import React from "react";
import { cn } from "../../lib/cn";

type Option = { value: string; label: string };

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
  options: Option[];
};

export default function Select({ label, error, hint, className, options, ...props }: Props) {
  return (
    <label className="block space-y-1">
      {label ? <span className="label">{label}</span> : null}
      <select
        className={cn(
          "input appearance-none bg-[rgba(255,255,255,.06)]",
          "pr-10",
          className,
          error && "border-[var(--danger)]"
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-[var(--danger)]">{error}</span> : null}
      {!error && hint ? <span className="help">{hint}</span> : null}
    </label>
  );
}
