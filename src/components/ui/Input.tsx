// import React from "react";
// import { cn } from "../../lib/cn";

// type Props = React.InputHTMLAttributes<HTMLInputElement> & {
//   label?: string;
//   error?: string;
//   hint?: string;
// };

// export default function Input({
//   label,
//   error,
//   hint,
//   className,
//   ...props
// }: Props) {
//   return (
//     <label className="block space-y-1">
//       {label ? <span className="label">{label}</span> : null}
//       <input
//         className={cn("input", className, error && "border-[var(--danger)]")}
//         {...props}
//       />
//       {error ? (
//         <span className="text-xs text-[var(--danger)]">{error}</span>
//       ) : null}
//       {!error && hint ? <span className="help">{hint}</span> : null}
//     </label>
//   );
// }

import React, { forwardRef } from "react";
import { cn } from "../../lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <label className="block space-y-1">
        {label ? <span className="label">{label}</span> : null}

        <input
          ref={ref}
          className={cn("input", className, error && "border-[var(--danger)]")}
          {...props}
        />

        {error ? (
          <span className="text-xs text-[var(--danger)]">{error}</span>
        ) : null}

        {!error && hint ? <span className="help">{hint}</span> : null}
      </label>
    );
  },
);

Input.displayName = "Input";

export default Input;
