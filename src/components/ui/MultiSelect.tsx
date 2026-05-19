// src/components/ui/MultiSelect.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "../../lib/cn";

export type MultiSelectOption = {
  value: string | number;
  label: string;
};

type Props = {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;

  options: MultiSelectOption[];

  value: (string | number)[];
  onChange: (values: (string | number)[]) => void;

  disabled?: boolean;
  className?: string;
};

export default function MultiSelect({
  label,
  error,
  hint,
  placeholder = "Select options",
  options,
  value,
  onChange,
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOptions = useMemo(
    () => options.filter((o) => value.map(String).includes(String(o.value))),
    [options, value],
  );

  function toggleValue(v: string | number) {
    const exists = value.map(String).includes(String(v));

    if (exists) {
      onChange(value.filter((x) => String(x) !== String(v)));
    } else {
      onChange([...value, v]);
    }
  }

  function removeValue(v: string | number) {
    onChange(value.filter((x) => String(x) !== String(v)));
  }

  return (
    <div className="space-y-1" ref={containerRef}>
      {label && <label className="label">{label}</label>}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((p) => !p)}
          className={cn(
            "w-full min-h-[48px] rounded-2xl border px-3 py-2 text-start transition",
            "flex flex-wrap items-center gap-2",
            "bg-[var(--card)] text-[var(--fg)]",
            "border-[var(--border)]",
            "hover:border-[var(--border2)]",
            "focus:border-[var(--primary2)]",
            "focus:ring-4 focus:ring-[var(--ring)]",
            "disabled:opacity-60 disabled:cursor-not-allowed ",

            error && "border-[var(--danger)] focus:ring-[rgba(239,68,68,.20)]",

            className,
          )}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-sm text-[var(--muted)]">{placeholder}</span>
          ) : (
            selectedOptions.map((item) => (
              <span
                key={item.value}
                className={cn(
                  "inline-flex items-center gap-1 rounded-xl px-2 py-1 text-xs font-medium",
                  "bg-[rgba(124,58,237,.18)]",
                  "border border-[var(--border2)]",
                )}
              >
                {item.label}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(item.value);
                  }}
                  className="opacity-70 hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}

          <ChevronDown
            className={cn(
              "absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 transition",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div
            className={cn(
              " z-[150] mt-2 max-h-72 w-full overflow-auto rounded-2xl border p-2",
              "bg-[var(--card)] text-[var(--fg)]",
              "border-[var(--border2)] shadow-2xl",
              "scrollbar",
            )}
          >
            {options.length === 0 ? (
              <div className="p-3 text-sm text-[var(--muted)]">
                No options found
              </div>
            ) : (
              options.map((option) => {
                const selected = value
                  .map(String)
                  .includes(String(option.value));

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleValue(option.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition mb-2",
                      "hover:bg-white/5",
                      selected &&
                        "bg-[rgba(124,58,237,.15)] border border-[var(--border)]",
                    )}
                  >
                    <span>{option.label}</span>

                    {selected && (
                      <Check className="h-4 w-4 text-[var(--primary2)]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {error ? (
        <span className="text-xs font-medium text-[var(--danger)]">
          {error}
        </span>
      ) : null}

      {!error && hint ? <span className="help">{hint}</span> : null}
    </div>
  );
}
