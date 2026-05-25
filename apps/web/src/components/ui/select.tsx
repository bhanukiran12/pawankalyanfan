import * as React from "react";
import { cn } from "@/lib/utils";

/** Dark-theme native select — readable closed label and dropdown options. */
export const selectClassName =
  "select-field flex h-10 w-full min-h-[44px] cursor-pointer appearance-none rounded-md border border-white/25 bg-zinc-950 px-3 py-2 pr-10 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:dark]";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(selectClassName, className)}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export { Select };
