import React from "react";
import { cn } from "../../lib/cn";

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label className={cn("inline-flex items-center gap-2 text-sm font-semibold", disabled && "opacity-60")}>
      <input
        type="checkbox"
        className="h-4 w-4 accent-[var(--primary)]"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
