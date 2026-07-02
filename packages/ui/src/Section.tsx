import type { ReactNode } from "react";
import { cx } from "./cx";

// The recurring content card: an editorial-micro-card with the small-caps-free
// header row the console repeats everywhere — text-sm semibold title on the
// left, an optional muted description under it, and actions (buttons or a
// muted count/hint) on the right. Bespoke card internals stay bespoke; this
// only owns the frame + header grammar.
export interface SectionProps {
  title: ReactNode;
  /** Muted supporting line under the title. */
  description?: ReactNode;
  /** Right side of the header row — buttons, or a muted <span> count/hint. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Space between the header row and the body (default mb-4). */
  headerGap?: "sm" | "md";
}

export function Section({ title, description, actions, children, className, headerGap = "md" }: SectionProps) {
  return (
    <section className={cx("editorial-micro-card rounded-lg p-5", className)}>
      <div className={cx("flex flex-wrap items-start justify-between gap-3", headerGap === "sm" ? "mb-2" : "mb-4")}>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-on-surface">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-secondary">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
