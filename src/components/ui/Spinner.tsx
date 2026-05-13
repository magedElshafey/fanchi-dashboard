import React from "react";
import { cn } from "../../lib/cn";

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--border2)] border-t-transparent",
        className
      )}
      aria-label="loading"
    />
  );
}
