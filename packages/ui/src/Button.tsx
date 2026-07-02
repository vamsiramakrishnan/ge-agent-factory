import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cx } from "./cx";

// THE button. Before this existed the console carried ~40 inline button
// recipes across five dialects (two class orders for primary, two spinner
// idioms, three paddings) — this is the one place the recipe lives now.
// Variants map to the design tokens the recipes already used:
//   primary  — filled brand action (bg-primary → hover primary-container)
//   outline  — secondary action (outline border, surface-container hover)
//   ghost    — tertiary/link-like action (text-primary, primary/10 hover)
// `loading` swaps in the one canonical spinner (lucide Loader2) and disables.
export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md";

const BASE = "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-container",
  outline: "border border-outline/30 text-on-surface hover:bg-surface-container",
  ghost: "text-primary hover:bg-primary/10",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "rounded-md px-3 py-1.5 text-sm",
  md: "rounded-md px-4 py-2 text-sm",
};

export function buttonClass({ variant = "primary", size = "md", className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cx(BASE, VARIANT[variant], SIZE[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Busy state: shows the canonical spinner and disables the button. */
  loading?: boolean;
  children?: ReactNode;
}

export function Button({ variant = "primary", size = "md", loading = false, disabled, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} disabled={disabled || loading} className={buttonClass({ variant, size, className })} {...rest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />}
      {children}
    </button>
  );
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
}

// Same recipe for anchor-shaped calls to action (hash navigation).
export function ButtonLink({ variant = "primary", size = "md", className, children, ...rest }: ButtonLinkProps) {
  return (
    <a className={buttonClass({ variant, size, className })} {...rest}>
      {children}
    </a>
  );
}
