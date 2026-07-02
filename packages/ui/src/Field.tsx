import type { ReactNode, SelectHTMLAttributes } from "react";
import { cx } from "./cx";

// Form primitives: one label idiom, one control recipe. The console had two
// divergent input/select dialects (outline/20+surface-container+primary/50 vs
// outline-variant/30+surface+primary/40); this is the canonical one.
export const CONTROL_CLASS =
  "w-full rounded-md border border-outline/20 bg-surface-container px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, className, children }: FieldProps) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1 block text-xs font-medium text-secondary">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-3xs text-secondary/80">{hint}</span>}
    </label>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...rest }: SelectProps) {
  return (
    <select className={cx(CONTROL_CLASS, className)} {...rest}>
      {children}
    </select>
  );
}
