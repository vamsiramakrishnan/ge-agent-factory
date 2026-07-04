import type { ReactNode } from "react";
import { cx } from "./cx";

// The one page-header grammar. Every console view opens with the same shape —
// eyebrow over title over subtitle on the left, meta chips (<Stat>) and action
// buttons right-aligned — closed by the canonical bottom rule
// (border-outline-variant/40 pb-6 mb-6). Before this existed each view carried
// its own slightly-different copy.
export interface PageHeaderProps {
  /** Small uppercase kicker above the title (e.g. "Spec to deploy"). */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** One-line purpose statement under the title (prose width, may hold links). */
  subtitle?: ReactNode;
  /** Right-aligned chips/stats row — usually <Stat size="sm"> tiles. */
  meta?: ReactNode;
  /** Right-aligned action buttons (Refresh, primary CTAs). */
  actions?: ReactNode;
  /** Title scale: "md" = text-2xl (default), "lg" = text-3xl (hero views). */
  size?: "md" | "lg";
  /** Extra full-width header content below the title row (filters, scopes). */
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, meta, actions, size = "md", children, className }: PageHeaderProps) {
  const hasRight = Boolean(meta || actions);
  return (
    <header className={cx("mb-6", className)}>
      <div className={cx("grid gap-5", hasRight && "xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end")}>
        <div className="min-w-0">
          {eyebrow && (
            // Engraved caption with a short rule — how a Braun fascia
            // captions the module underneath it.
            <div className="mb-1.5 flex items-center gap-3">
              <span className="engraved">{eyebrow}</span>
              <span className="h-px w-10 bg-outline-variant" aria-hidden />
            </div>
          )}
          <h1 className={cx("font-headline font-semibold tracking-tight text-on-surface", size === "lg" ? "text-3xl" : "text-2xl")}>{title}</h1>
          {subtitle && <p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">{subtitle}</p>}
        </div>
        {hasRight && (
          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            {meta}
            {actions}
          </div>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
      {/* The closing rule is a measuring scale, not a plain border — the
          T1000's tuning-dial ticks as the page's one structural flourish. */}
      <div className="ticks-x mt-6 h-1.5 border-b border-outline-variant/60" aria-hidden />
    </header>
  );
}
