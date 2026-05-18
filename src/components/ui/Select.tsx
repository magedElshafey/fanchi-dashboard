// import React from "react";
// import { ChevronDown } from "lucide-react";
// import { cn } from "../../lib/cn";

// type Option = {
//   value: string | number;
//   label: string;
// };

// type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
//   label?: string;
//   error?: string;
//   hint?: string;
//   placeholder?: string;
//   options: Option[];
// };

// export default function Select({
//   label,
//   error,
//   hint,
//   className,
//   options,
//   placeholder,
//   disabled,
//   ...props
// }: Props) {
//   return (
//     <label className="block space-y-1">
//       {label && <span className="label">{label}</span>}

//       <div className="relative">
//         <select
//           disabled={disabled}
//           className={cn(
//             "w-full appearance-none rounded-xl border px-3 py-2.5 pr-11 text-sm outline-none transition-all duration-200",
//             "bg-[var(--card)] text-[var(--fg)]",
//             "border-[var(--border)]",
//             "placeholder:text-[var(--muted)]",

//             // focus
//             "focus:border-[var(--primary2)]",
//             "focus:ring-4 focus:ring-[var(--ring)]",

//             // hover
//             "hover:border-[var(--border2)]",

//             // disabled
//             "disabled:cursor-not-allowed disabled:opacity-60",

//             // dark mode enhancement
//             "backdrop-blur-md",

//             // error
//             error && "border-[var(--danger)] focus:ring-[rgba(239,68,68,.20)]",

//             className,
//           )}
//           {...props}
//         >
//           {placeholder && (
//             <option
//               value=""
//               disabled
//               hidden
//               className="bg-[var(--bg)] text-[var(--muted)]"
//             >
//               {placeholder}
//             </option>
//           )}

//           {options.map((option) => (
//             <option
//               key={option.value}
//               value={option.value}
//               className="bg-[var(--bg)] text-[var(--fg)]"
//             >
//               {option.label}
//             </option>
//           ))}
//         </select>

//         <ChevronDown
//           size={18}
//           className={cn(
//             "pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 transition",
//             "text-[var(--muted)]",
//             !disabled && "group-hover:text-[var(--fg)]",
//           )}
//         />
//       </div>

//       {error ? (
//         <span className="text-xs font-medium text-[var(--danger)]">
//           {error}
//         </span>
//       ) : null}

//       {!error && hint ? <span className="help">{hint}</span> : null}
//     </label>
//   );
// }

// src/components/ui/Select.tsx
import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export type SelectOption = {
  value: string | number;
  label: string;
};

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: SelectOption[];
};

export default function Select({
  label,
  error,
  hint,
  className,
  options,
  placeholder,
  disabled,
  id,
  ...props
}: Props) {
  // Derive a stable id for the label→input association
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="block space-y-1">
      {label && (
        <label htmlFor={selectId} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-xl border px-3 py-2.5 pr-11 text-sm outline-none transition-all duration-200",
            "bg-[var(--card)] text-[var(--fg)]",
            "border-[var(--border)]",
            "placeholder:text-[var(--muted)]",
            "focus:border-[var(--primary2)]",
            "focus:ring-4 focus:ring-[var(--ring)]",
            "hover:border-[var(--border2)]",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "backdrop-blur-md",
            error && "border-[var(--danger)] focus:ring-[rgba(239,68,68,.20)]",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option
              value=""
              disabled
              className="bg-[var(--bg)] text-[var(--muted)]"
            >
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[var(--bg)] text-[var(--fg)]"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 transition",
            "text-[var(--muted)]",
            !disabled && "group-hover:text-[var(--fg)]",
          )}
        />
      </div>
      {error && (
        <span role="alert" className="text-xs font-medium text-[var(--danger)]">
          {error}
        </span>
      )}
      {!error && hint && <span className="help">{hint}</span>}
    </div>
  );
}
