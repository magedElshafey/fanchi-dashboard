import React from "react";
import { cn } from "../../lib/cn";

type Variant = "default" | "primary" | "ghost" | "danger";

export default function Button({
  className,
  variant = "default",
  loading,
  leftIcon,
  rightIcon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}) {
  const styles =
    variant === "primary"
      ? "btn btn-primary"
      : variant === "ghost"
      ? "btn btn-ghost"
      : variant === "danger"
      ? "btn border-transparent bg-[var(--danger)] text-white hover:opacity-95"
      : "btn";

  return (
    <button
      className={cn(styles, "disabled:opacity-60 disabled:cursor-not-allowed", className)}
      {...props}
      disabled={props.disabled || loading}
    >
      {leftIcon}
      {loading ? <span className="text-xs opacity-90">…</span> : props.children}
      {rightIcon}
    </button>
  );
}
