import React from "react";
import { cn } from "../../lib/cn";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-sm",
        "border-[var(--border2)] bg-[rgba(255,255,255,.06)]"
      )}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "h-5 w-9 rounded-full relative transition",
          checked ? "bg-[var(--primary)]" : "bg-[rgba(148,163,184,.35)]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition",
            checked ? "left-[18px]" : "left-0.5"
          )}
        />
      </span>
      {label ? <span className="text-xs font-semibold opacity-90">{label}</span> : null}
    </button>
  );
}
